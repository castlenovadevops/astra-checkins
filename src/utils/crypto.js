const CryptoJS = require('crypto-js');

export default class Crypto{
    privateKey = "HVXNGTIYS11VY7MK";//process.env.REACT_APP_ENCRYPTKEY; 

    AESEncrypt(content) {
        const parsedkey = CryptoJS.enc.Utf8.parse(this.privateKey);
        const iv = CryptoJS.enc.Utf8.parse(this.privateKey);
        const encrypted = CryptoJS.AES.encrypt(JSON.stringify(content), parsedkey, { iv: iv, mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
        return encrypted.toString();
    };
        
    AESDecrypt(word) { 
        var keys = CryptoJS.enc.Utf8.parse(this.privateKey);
        let base64 = CryptoJS.enc.Base64.parse(word);
        let src = CryptoJS.enc.Base64.stringify(base64);
        var decrypt = CryptoJS.AES.decrypt(src, keys, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
        return JSON.parse(decrypt.toString(CryptoJS.enc.Utf8));
    };
}