const baseController = require('../common/baseController');
const MsgController = require('../common/msgController');
const CommonController  = require('../common/commonController');

const express = require('express');
const authenticate = require('../../middleware/index');  
const Sequelize   = require('sequelize'); 


module.exports = class LoyaltyPointsController extends baseController{
    path = "/merchant/lpsettings";
    router = express.Router();
    routes = [];
    msgController = new MsgController();
    commonController = new CommonController();
    constructor(props){
        super(props);
    }

    initialize(){ 
        return new Promise((resolve) => {
            this.routes = [    
                {
                    path:this.path+"/save",
                    type:"post",
                    method: "saveSettings",
                    authorization:'accessAuth'
                },   
                {
                    path:this.path+"/getSettings",
                    type:"post",
                    method: "getSettings",
                    authorization:'accessAuth'
                },    
                {
                    path:this.path+"/saveActivationSettings",
                    type:"post",
                    method: "saveActivationSettings",
                    authorization:'accessAuth'
                },   
                {
                    path:this.path+"/getActivationSettings",
                    type:"post",
                    method: "getActivationSettings",
                    authorization:'accessAuth'
                }, 
                {
                    path:this.path+"/saveRedeemSettings",
                    type:"post",
                    method: "saveRedeemSettings",
                    authorization:'accessAuth'
                },   
                {
                    path:this.path+"/getRedeemSettings",
                    type:"post",
                    method: "getRedeemSettings",
                    authorization:'accessAuth'
                }, 
            ]  
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    } 

    getSettings = async(req,res, next)=>{
        const lpsettings = await this.readOne({where:{status:1, merchantId: req.deviceDetails.merchantId}}, 'LPSettings')
       
        this.sendResponse({data: lpsettings}, res, 200);
    }

    saveSettings = async(req, res, next)=>{
        var input= req.input;
        input["createdBy"] = req.userData.mEmployeeId;
        input["createdDate"] = this.getDate();
        input["updatedDate"] = this.getDate();
        input["merchantId"] =  req.deviceDetails.merchantId;
        var settingsdetail = await this.readOne({where:{merchantId: input.merchantId, status:1}}, 'LPSettings')
        if(settingsdetail !== null){
            this.update('LPSettings', {status:0, merchantId: input.merchantId, id: settingsdetail.dataValues["id"] || settingsdetail.id }, {where :{merchantId: input.merchantId}}).then(r=>{
                delete input["id"];
                this.create('LPSettings', input).then(r=>{
                    this.sendResponse({message:"Loyalty point settings has been saved successfully."}, res, 200)
                })
            })
        }else{
            this.create('LPSettings', input).then(r=>{
                this.sendResponse({message:"Loyalty point settings has been saved successfully."}, res, 200)
            })
        }
    }

    getActivationSettings = async(req,res, next)=>{
        const lpsettings = await this.readOne({where:{status:1, merchantId: req.deviceDetails.merchantId}}, 'LPActivationSettings')
       
        this.sendResponse({data: lpsettings}, res, 200);
    }

    saveActivationSettings = async(req, res, next)=>{
        var input= req.input;
        input["createdBy"] = req.userData.mEmployeeId;
        input["createdDate"] = this.getDate();
        input["updatedDate"] = this.getDate();
        input["merchantId"] =  req.deviceDetails.merchantId;
        delete input["id"];
        var settingsdetail = await this.readOne({where:{merchantId: input.merchantId, status:1}}, 'LPActivationSettings')
        if(settingsdetail !== null){
            this.update('LPActivationSettings', {status:0, merchantId: input.merchantId, id: settingsdetail.dataValues["id"] || settingsdetail.id }, {where :{merchantId: input.merchantId}}).then(r=>{
                this.create('LPActivationSettings', input).then(r=>{
                    this.sendResponse({message:"Loyalty point settings has been saved successfully."}, res, 200)
                })
            })
        }
        else{
            this.create('LPActivationSettings', input).then(r=>{
                this.sendResponse({message:"Loyalty point settings has been saved successfully."}, res, 200)
            })
        }
    }

    getRedeemSettings = async(req, res, next)=>{

        const lpredeemsettings = await this.readAll({where:{status:1, merchantId: req.deviceDetails.merchantId}}, 'LPRedeemSettings')
       
        this.sendResponse({data: lpredeemsettings}, res, 200);
    }

    saveRedeemSettings = async(req, res, next)=>{  
        var results = await this.readAll({where:{merchantId: req.deviceDetails.merchantId, status:1}}, 'LPRedeemSettings');
        if(results.length > 0){
            results.forEach(async (element, i) => { 
                await this.update('LPRedeemSettings', {status:0, merchantId: req.deviceDetails.merchantId, id: element.id }, {where :{id: element.id}}, false)
                if(i === results.length-1){
                    this.saveIndividualSettings(req, res, next, 0)
                }
            });
        }
        else{
            this.saveIndividualSettings(req, res, next, 0) 
        }
    }


    saveIndividualSettings = async (req, res, next, i)=>{

        var inputobj= req.input;
        if(i < inputobj.settings.length){
            var input = inputobj.settings[i];
            input["createdBy"] = req.userData.mEmployeeId;
            input["createdDate"] = this.getDate();
            input["updatedDate"] = this.getDate();
            input["merchantId"] =  req.deviceDetails.merchantId;
            delete input["id"];
                this.create('LPRedeemSettings', input).then(r=>{
                    this.saveIndividualSettings(req, res, next, i+1)
                })
        }
        else{
            this.sendResponse({message:"Loyalty point settings has been saved successfully."}, res, 200)
        }
    }
}