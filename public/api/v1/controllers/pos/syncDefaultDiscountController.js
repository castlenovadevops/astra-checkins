/* eslint-disable no-useless-constructor */
const baseController = require('../common/baseController');
const MsgController = require('../common/msgController'); 
const express = require('express'); 
const APIManager = require('../../utils/apiManager'); 

const settings = require('../../config/settings');  

module.exports = class SyncDefaultDiscountController extends baseController{
    path = "/pos/syncData";
    router = express.Router();
    routes = [];
    apiManager = new APIManager();
    msgController = new MsgController();
    constructor(props){
        super(props);
    }

    initialize(){ 
        return new Promise((resolve) => {
            this.routes = [
                {
                    path:this.path+"/defaultDiscountDivision",
                    type:"post",
                    method: "syncDiscount",
                    authorization:'accessAuth'
                }
            ]
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    } 
    
    syncDiscount = async(req, res, next)=>{ 
            this.pullData(req, res, next) 
    } 

    pullData = async(req, res, next)=>{ 
        
        var input = { 
            merchantId: req.deviceDetails.merchantId,
            POSId: req.deviceDetails.device.POSId,
            // syncAll: true
        }
        this.apiManager.postRequest('/pos/sync/getDefaultDiscountDivision',  input ,req).then(resp=>{ 
            if(resp.response.data.length > 0){
                this.saveData(0, resp.response.data, req, res, next)
            }
            else{
                this.sendResponse({message:"Discount Module synced successfully"}, res, 200);
            }
        })
    }

    saveData = async(idx,discounts, req, res, next)=>{ 
        if(idx<discounts.length){ 
            let  exist = await this.readOne({where:{merchantId: discounts[idx].merchantId, status:1}}, 'mDefaultDiscountDivision')
            if( exist !== null){
                this.delete('mDefaultDiscountDivision', {merchantId:  discounts[idx].merchantId}).then(r=>{
                    this.create('mDefaultDiscountDivision', discounts[idx], false).then(async r=>{
                        this.saveData(idx+1, discounts, req, res, next)
                    })
                })
            }
            else{
                this.create('mDefaultDiscountDivision', discounts[idx], false).then(async r=>{  
                        this.saveData(idx+1,discounts, req, res, next)
                })
            }
        }
        else{ 
            this.sendResponse({message:"Discount Module synced successfully"}, res, 200);  
        }
    }
}