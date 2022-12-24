// routes
import Router from './routes'; 
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/ScrollToTop';
// import { BaseOptionChartStyle } from './components/chart/BaseOptionChart';
import { deviceDetect } from 'react-device-detect';
// ---------------- ------------------------------------------------------
import HTTPManager from './utils/httpRequestManager';
import React from 'react';
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './app.css';

import Socket from './socket';


export default class App extends React.Component{
  httpManager = new HTTPManager();

  constructor(){
    super();
    this.state={

    }
  }

  componentDidMount(){ 
    var accessToken=window.localStorage.getItem('accessToken') || '' 
    if(accessToken === ''){ 
      this.httpManager.postRequest(`common/getToken`, deviceDetect(window.navigator.userAgent)).then(response=>{ 
        // console.log("REOPNSE")
        // console.log(response)
        window.localStorage.setItem('accessToken', response.token) 
        toast.success(response.message,  {
            position: "top-center",
            autoClose: 5000,
            closeButton:false,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
        })
      }).catch(error=>{ 
        // console.log(error);
        toast.error(error.message, {
          position: "top-center",
          autoClose: 5000,
          closeButton:false,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
      });
      })
    } 
  }

  render(){
    return ( 
        <ThemeProvider>
          <ScrollToTop /> 

      <ToastContainer
                  position="top-center"
                  autoClose={5000}
                  hideProgressBar
                  newestOnTop={false}
                  closeOnClick={false}
                  rtl={false}
                  pauseOnFocusLoss={false}
                  draggable={false}
                  pauseOnHover={false}
                  />
                  <Socket />
            <Router />
        </ThemeProvider> 
    );
  }
}
