const baseController = require('../common/baseController');
const MsgController = require('../common/msgController');

const express = require('express');
const authenticate = require('../../middleware/index');  
module.exports = class CategoryController extends baseController{
    path = "/merchant/category";
    router = express.Router();
    msgController = new MsgController(); 
    routes = [];
    constructor(props){
        super(props);
    }

    initialize(){ 
        return new Promise((resolve) => {

            this.routes = [
                {
                    path:this.path+"/save",
                    type:"post",
                    method: "saveCategory",
                    authorization:'accessAuth'
                },
                {
                    path:this.path+"/get",
                    type:"post",
                    method: "getCategory",
                    authorization:'accessAuth'
                },
                {
                    path:this.path+"/update",
                    type:"post",
                    method: "updateCategory",
                    authorization:'accessAuth'
                }
            ]
            // this.router.post(this.path+"/save", authenticate.accessAuth, this.saveCustomer); 
            this.router.post(this.path+"/save", authenticate.authorizationAuth, this.saveCategory); 
            this.router.get(this.path+"/get", authenticate.authorizationAuth, this.getCategory); 
            this.router.post(this.path+"/update", authenticate.authorizationAuth, this.updateCategory); 
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    } 

    saveCategory = async(req,res,next)=>{
        var input = req.input;
        input.merchantId = req.deviceDetails.merchantId;
        input.mCategoryStatus = 1;
        input.createdBy= req.userData.mEmployeeId;
        input.createdDate = this.getDate(); 
        input.updatedBy=  req.userData.mEmployeeId;
        input.updatedDate = this.getDate();
        // console.log(input)
        if(input.id !== undefined){
            this.update('mCategory', input, {where:{id :input.id}}).then(resp=>{
                this.sendResponse({message:"Updated sucessfully"}, res, 200)
            })
        }
        else{
            this.create('mCategory', input).then(resp=>{
                this.sendResponse({message:"Saved sucessfully"}, res, 200)
            })
        }
    }

    getCategory = async (req,res,next)=>{ 
        let category = await this.readAll({
            where:{
                merchantId:req.deviceDetails.merchantId
            },
            order: [
                ['createdDate','ASC']
            ], 
        }, 'mCategory')
        this.sendResponse({ data: category}, res, 200);
    }

    updateCategory = async(req, res,next)=>{ 
        const input = req.input; 
        const user = req.userData;  
        var data = {
            mCategoryStatus: input.mCategoryStatus,
            updatedBy: user.id,
            updatedDate: this.getDate()
        }
        this.update('mCategory', data, {where:{id:input.id}}).then(r1=>{
            this.sendResponse({message:"Category details updated successfully."}, res, 200);
        })
    }
}