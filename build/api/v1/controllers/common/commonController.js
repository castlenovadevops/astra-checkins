const baseController = require('../common/baseController');
 
module.exports = class CommonController extends baseController{
    path = "/common"
    initialize(){
       
        return new Promise((resolve) => {
            this.routes = [
                {
                    path:this.path+"/getToken",
                    type:"post",
                    method: "getToken"
                },
            ]
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    }

    getToken = async (req,res,next)=>{  
        var input = req.body;  
        // console.log("TOKEN METHOD CALLED")
        this.sendResponse({msg:'Token sent successfully.', token:this.generaterandomString(16)}, res, 200);
    }
}