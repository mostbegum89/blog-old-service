import React, { Component } from "react";
import CircularProgress from '@material-ui/core/CircularProgress';
import Cookies from "js-cookie";
import axios from "axios";
//import {setToast} from './ToastMsg'
import store from "../store";
import { io } from "socket.io-client";

const configureAxiosHeader = () => {
    axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL
  const token = Cookies.get("flikhs_auth");
  if(token){
    axios.defaults.headers.common = {
      Authorization: token,
    };
  }
 
};

const loadChats=()=>{
  axios.get('/chat/mychats')
  .then(res => {
    store.dispatch({
      type:"SET_CHATS",
      payload:res.data.chats
    })
  })
  .catch(err => {
      console.log(err);
  })
}
const loadNotifications=()=>{
  axios.get('/notification')
  .then(res => {
    store.dispatch({
      type:"SET_NOTIFICATIONS",
      payload:res.data.notifications
    })
  })
  .catch(err => {
      console.log(err);
  })
}


export let socket

const WithAuth = (AuthComponent) => {
  return class Authenticated extends Component {
    static async getInitialProps(ctx) {
      // Ensures material-ui renders the correct css prefixes server-side
      let userAgent;
      // eslint-disable-next-line no-undef
      if (process.browser) {
        // eslint-disable-next-line prefer-destructuring
        userAgent = navigator.userAgent;
      } else {
        userAgent = ctx.req?.headers["user-agent"];
      }

      // Check if Page has a `getInitialProps`; if so, call it.
      const pageProps =
        AuthComponent.getInitialProps &&
        (await AuthComponent.getInitialProps(ctx));
      // Return props.
      return { ...pageProps, userAgent };
    }

    constructor(props) {
      super(props);
      this.state = {
        isLoading: false,
        userData: [],
      };
    }

    componentDidMount() {
     
      configureAxiosHeader();
      const token = Cookies.get("flikhs_auth")
      //console.log(token);
      if(token){
        this.setState({ isLoading: true });
        axios
        // eslint-disable-next-line no-undef
        .post(`${process.env.NEXT_PUBLIC_API_URL}/user/verify`, {})
        .then((res) => {
          loadChats()
          loadNotifications()
          if (res.status === 200 && res.data.success) {
            var options = {
              rememberUpgrade: true,
              transports: ['websocket'],
              secure: true,
              rejectUnauthorized: false
            }
            socket = io(process.env.NEXT_PUBLIC_API_URL,options);
            //console.log(socket);
           
            socket.emit("online",{id:res.data.user._id})
            //do some change state
            //console.log(res.data.user);
            this.setState({ userData: res.data.user });
            this.setState({ isLoading: false });
            store.dispatch({
                type:"SET_USER",
                payload:res.data.user
            })
            store.dispatch({
                type: 'SET_PROFILE',
                payload:res.data.user
          
              })
          }
        })
        .catch((err) => {
            this.setState({ isLoading: false });
            err && err.response && console.log(err.response.data.error,"error")
          Cookies.remove("flikhs_auth");
          err && err.response && err.response.data.error &&  alert(err.response.data.error)
          store.dispatch({
              type:"LOGOUT"
          })
          //console.log(window.location.pathname)
        //   if(window.location.pathname !== '/login'){
        //     window.location.pathname='/login'
        //   }
           //window.location.pathname='/login'
        });
      }
      
    }

    render() {
      return (
        <div>
          {this.state.isLoading ? (
            <div style={{height:"100vh",width:"100vw",display:"flex",justifyContent:"center",alignItems:"center"}}>
            <CircularProgress color="primary" />
            </div>
          ) : (
            <AuthComponent {...this.props} userData={this.state.userData} />
          )}
        </div>
      );
    }
  };
};
export default WithAuth;
