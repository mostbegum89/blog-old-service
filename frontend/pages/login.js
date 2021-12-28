
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { setToast } from "../components/ToastMsg";


import Navbar from '../components/NavbarComp'

import CircularProgress from "@material-ui/core/CircularProgress";
import Cookies from "js-cookie";


export default function Login() {




    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [load, setload] = useState(false);


    let dispatch = useDispatch();
    let history = useHistory();

    let handleSignin = (e) => {
        setload(true);
        e.preventDefault();
        let user = {
            email,
            password,
        };
        axios
            .post("/user/signin", user)
            .then((res) => {
                //console.log(res.data);
                if (res.status === 200) {
                    Cookies.set("flikhs_auth", res.data.token);
                    //localStorage.setItem('auth_token1', res.data.token)
                    // dispatch({type:"SET_USER", payload: res.data.user})
                    // dispatch({type:"SET_PROFILE", payload: res.data.user})
                    setToast("Signin success", "success");
                    setload(false);
                    window.location.pathname = '/'
                }
            })
            .catch((err) => {
                err.response && setError(err.response.data);
                setload(false);
            });
    };


    return (
        <>
            <Navbar />

            <div className="container">

                <div className="login_container">
                    <div className="row login_main_content bg-success text-center">
                        <div className="col-md-4 text-center company__info">
                            <span className="company__logo">
                                <img src="/logo.png"></img>
                            </span>
                            {/* <h4 className="company_title">Your Company Logo</h4> */}
                        </div>
                        <div className="col-md-8 col-xs-12 col-sm-12 login_form ">
                            <div className="container-fluid">
                                <div className="row">
                                    <h2 className="mt-2">Login</h2>
                                </div>
                                {error && error.error ? (
                                    <p style={{ color: "red" }}>{error.error}</p>
                                ) : null}
                                <div className="row">
                                    <form onSubmit={handleSignin} className="form-group">
                                        <div className="row mb-3">
                                            <input
                                                onChange={(e) => setEmail(e.target.value)}
                                                type="email"
                                                name="email"
                                                id="email"
                                                className={`form-control form__input ${error && error.email && "is-invalid"}`}
                                                placeholder="Email"
                                            />
                                            {
                                                error && error.email && <div className="invalid-feedback">{error.email}</div>
                                            }
                                        </div>
                                        <div className="row">
                                            {/* <!-- <span className="fa fa-lock"></span> --> */}
                                            <input
                                                onChange={(e) => setPassword(e.target.value)}
                                                type="password"
                                                name="password"
                                                id="password"
                                                className={`form-control form__input ${error && error.password && "is-invalid"}`}
                                                placeholder="Password"
                                            />
                                            {
                                                error && error.password && <div className="invalid-feedback">{error.password}</div>
                                            }
                                        </div>
                                        {/* <div className="row">
								<input type="checkbox" name="remember_me" id="remember_me" className="" />
								<label for="remember_me">Remember Me!</label>
							</div> */}
                                        <div className="row">
                                            <button type="submit" className="btn" >{
                                                load ? <CircularProgress color="white" size={30} /> : 'Sign In'
                                            } </button>
                                        </div>
                                    </form>
                                </div>
                                <div className="row py-4">
                                    {/* <p>
                  Don't have an account? <a href="#">Register Here</a>
                </p> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}
