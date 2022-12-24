const jwt = require('jsonwebtoken');


// don't forget to add a secret KEY

const secretKey = 'FGVxjxaLbnLT';
const Crypto= require('../utils/crypto');
const crypto = new Crypto();

module.exports = (req, res, next) => { 

    // console.log("ACCESS AUTH CALLEd")
    try {
        const token = req.headers.accesstoken;   
        if(token){
            if(req.body.data){
                req.input = crypto.AESDecrypt( req.body.data); 
                // console.log(crypto.AESDecrypt( req.body.data)); 
            }
            const devicetoken = req.headers.devicetoken 
            if(devicetoken!== undefined){
                const decoded_device = jwt.verify(devicetoken, secretKey); 
                req.deviceDetails = decoded_device; 
                // // console.log("DECODED DEVICE");
                // // console.log(decoded_device);
                // console.log(req.deviceDetails)
            }
            next();
        }
        else{
            return res.status(400).json({
                message: 'Access token failed'
            });
        }
    } catch (error) { 
        return res.status(401).json({
            message: 'Access token failed'
        });
    }
};
