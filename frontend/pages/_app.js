

import '../styles/sass/main.scss'
import 'react-quill/dist/quill.snow.css'
import 'antd/dist/antd.css'


import { Provider } from 'react-redux';
import App from 'next/app'
import auth from '../helper/auth.js'


import React from 'react';
import { createWrapper } from 'next-redux-wrapper'
import store from '../store'
import Cookies from "js-cookie";
import axios from "axios";


import Router from 'next/router';
import NProgress from 'nprogress'; //nprogress module
import 'nprogress/nprogress.css'; //styles of nprogress
NProgress.configure({ showSpinner: false });
//Binding events. 
Router.events.on('routeChangeStart', () => NProgress.start()); Router.events.on('routeChangeComplete', () => NProgress.done()); Router.events.on('routeChangeError', () => NProgress.done());





class MyApp extends App {
  

  render() {
    const { Component, pageProps } = this.props
    return (
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    )
  }
}



const makestore = () => store
const wrapper = createWrapper(makestore)

export default wrapper.withRedux(auth(MyApp))









