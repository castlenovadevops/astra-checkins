import axios from 'axios';
import Crypto from './crypto';

export default class HTTPManager{
    API_URL = process.env.REACT_APP_LOCALAPIURL;
    crypto = new Crypto();

    getAuthHeader(){
        var accessToken = window.localStorage.getItem('accessToken') || '';
        var authorizationToken = window.localStorage.getItem('token') || '';
        var devicetoken = window.localStorage.getItem('devicetoken') || '';
        if(authorizationToken !== ''){
            return {"Authorization" : "Bearer "+authorizationToken, "accessToken" : accessToken , "devicetoken":devicetoken}
        }
        else if(devicetoken !== ''){
            return {"accessToken" : accessToken, "devicetoken":devicetoken}
        }
        else if(accessToken !== ''){
            return {"accessToken" : accessToken }
        }
        else{
            return {}
        }
    } 

    getRequest(url){
        return new Promise((resolve, reject)=>{ 
            // if(url.indexOf('pos/checkSyncCode') !== -1){
                // url = process.env.REACT_APP_APIURL+urlREACT_APP_LOCALAPIURL
            // }

            if(url.indexOf('http') === -1){
                url = process.env.REACT_APP_LOCALAPIURL+url
            }
            axios.get( url, {headers: this.getAuthHeader()}).then(response=>{ 
                // resolve(response.data); 
                // console.log(response.data)
               resolve(this.crypto.AESDecrypt(response.data));
            }).catch(error=>{
                // console.log(error)
                if(error.response !== undefined){
                    if(error.response.status === 401){
                        window.localStorage.clear();
                    }
                }
                reject(error);
            }) 

        })
    }

    postRequest(url, input){
        return new Promise((resolve, reject)=>{ 
            if(url.indexOf('http') === -1){
                url = process.env.REACT_APP_LOCALAPIURL+url
            }
            axios.post(url, {data:this.crypto.AESEncrypt(input)}, {headers: this.getAuthHeader()}).then(response=>{ 
                var requestresponse = response;
                // console.log(response)
                if(response.status !== 200){
                    requestresponse = response.response;
                } 
                console.log(this.crypto.AESDecrypt(requestresponse.data))
               resolve(this.crypto.AESDecrypt(requestresponse.data));
            }).catch(error=>{
                // console.log(error)
                var requestresponse = error;

                if(error.response !== undefined){
                    if(error.response.status  === 401){
                        window.localStorage.clear();
                        window.location.reload();
                    }
                }
                if(error.status !== 200){
                    requestresponse = error.response;
                }
                if(requestresponse === undefined){
                    requestresponse={status:400, data:''}
                }
                // console.log(this.crypto.AESDecrypt(requestresponse.data))
                reject(this.crypto.AESDecrypt(requestresponse.data));
            }) 
        })
    }
}
 
