import React, { Component } from "react";
import { Spin } from 'antd';
import Cookies from "js-cookie";
import axios from "axios";

import store from "../store/index";

const configureAxiosHeader = () => {
    axios.defaults.baseURL = process.env.REACT_APP_API
  const token = Cookies.get("flikhs_admin");
  axios.defaults.headers.common = {
    Authorization: token,
  };
};

const withAuth = (AuthComponent) => {
  return class Authenticated extends Component {

    constructor(props) {
      super(props);
      this.state = {
        isLoading: true,
        userData: [],
      };
    }

    componentDidMount() {
      this.setState({ isLoading: true });
      configureAxiosHeader();
      const token = Cookies.get("flikhs_admin");
      if(token){

      
        axios
          .post(`${process.env.REACT_APP_API}/user/verify`, {})
          .then((res) => {
            if (res.status === 200 && res.data.success) {
              //do some change state
              this.setState({ userData: res.data.user });
              this.setState({ isLoading: false });
              store.dispatch({
                  type:"SET_USER",
                  payload:res.data.user
              })
            }
          })
          .catch((err) => {
              this.setState({ isLoading: false });
            Cookies.remove("flikhs_admin");
            console.log(err.message);
            store.dispatch({
                type:"LOGOUT"
            })
            if(window.location.pathname !== '/login'){
             
                window.location.pathname='/login'

            }
            
          });
      }else{
        this.setState({ isLoading: true });
  
        if(window.location.pathname !== '/login'){
            if(window.location.pathname === '/register'){
             return
            }else{
              window.location.pathname='/login'
            }
         
        }
        this.setState({ isLoading: false });
      }
     
    }

    render() {
      return (
        <div>
          {this.state.isLoading ? (
            <div style={{height:"100vh",display:"flex",justifyContent:"center",alignItems:"center"}}><Spin size={'large'}/></div>
          ) : (
            <AuthComponent {...this.props} userData={this.state.userData} />
          )}
        </div>
      );
    }
  };
};
export default withAuth;
