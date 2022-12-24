const baseController = require('../common/baseController');
const MsgController = require('../common/msgController');

const express = require('express');
const authenticate = require('../../middleware/index'); 
const Sequelize = require('sequelize')
const sequelize =  require('../../models').sequelize
module.exports = class EmployeeCommissionController extends baseController{
    path = "/merchant/employeecommission";
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
                    path:this.path+"/getCommission",
                    type:"post",
                    method: "getCommission",
                    authorization:'accessAuth'
                }, 
                {
                    path:this.path+"/saveCommission",
                    type:"post",
                    method: "saveCommission",
                    authorization:'accessAuth'
                },  
            ]
            // this.router.post(this.path+"/getCommission", authenticate.authorizationAuth, this.getCommission);  
            // this.router.post(this.path+"/saveCommission", authenticate.authorizationAuth, this.saveCommission);  
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    } 

    getCommission= async(req, res, next)=>{
        var input = req.input;

        let options = {
            where:{
                merchantId: req.deviceDetails.merchantId,
                mEmployeeId: input.mEmployeeId,
                status:1
            }
        }

        this.readOne(options, 'mEmployeeCommission').then(commission=>{
            this.sendResponse({data: commission}, res, 200)
        })
    }


    saveCommission = async(req, res, next)=>{
        var input = req.input;
        input.merchantId = req.deviceDetails.merchantId;
        input.createdBy = req.userData.mEmployeeId
        input.updatedBy = req.userData.mEmployeeId
        input.createdDate = this.getDate()
        input.updatedDate = this.getDate()
        // console.log(input);
        this.update('mEmployeeCommission', {status:0, updatedDate: this.getDate(), updatedBy: req.userData.mEmployeeId}, {where:{merchantId: req.deviceDetails.merchantId, mEmployeeId: input.mEmployeeId, status:1}}).then(r=>{
            this.create('mEmployeeCommission', input).then(r=>{
                this.sendResponse({message:"Commission details saved successfully."}, res, 200);
            })
        })
    }
}