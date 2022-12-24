/* eslint-disable no-useless-constructor */
const baseController = require('../common/baseController');
const MsgController = require('../common/msgController'); 
const express = require('express'); 
const APIManager = require('../../utils/apiManager'); 

const settings = require('../../config/settings'); 
const pkfields = {
    'mDiscounts':"id"
}

module.exports = class SyncTaxController extends baseController{
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
                    path:this.path+"/discounts",
                    type:"post",
                    method: "syncDiscount",
                    authorization:'accessAuth'
                }
            ]
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    } 
    
    syncDiscount = async(req, res, next)=>{
        let toBeSynced = await this.readAll({where:{syncTable:'mDiscounts'}}, 'toBeSynced')
        if(toBeSynced.length > 0){  
            console.log("TOBE SYNC DISCOUNT CALLED: :::", toBeSynced.length)
            this.syncData(0, toBeSynced, req, res, next);
        }
        else{
            this.pullData(req, res, next)
        }
    }

    syncData = async(idx, toBeSynced, req, res, next)=>{
        if(idx < toBeSynced.length ){ 
            let tobesync = toBeSynced[idx];
            console.log("TOBE SYNC DISCOUNT CALLED")
            let datares = await this.readOne({where:{
                id: tobesync.tableRowId
            }}, 'mDiscounts')
            var data = datares.dataValues
            data["createdDate"] = data["createdDate"].replace("T"," ").replace("Z","");
            data["updatedDate"] = data["updatedDate"].replace("T"," ").replace("Z","");
            data["addedOn"] = req.deviceDetails.device.POSId || 'POS';
            console.log(data)
            this.apiManager.postRequest('/pos/sync/saveDiscount', data , req).then(response=>{
                this.delete('toBeSynced', {tableRowId: toBeSynced[idx].tableRowId, syncTable: toBeSynced[idx].syncTable}).then(r=>{    
                    this.syncData(idx+1, toBeSynced, req, res, next);
                })
            }) 
        }
        else{
            this.pullData(req, res, next)
        }
    }

    pullData = async(req, res, next)=>{ 
        
        var input = { 
            merchantId: req.deviceDetails.merchantId,
            POSId: req.deviceDetails.device.POSId,
            // syncAll: true
        }
        this.apiManager.postRequest('/pos/sync/getDiscounts',  input ,req).then(resp=>{ 
            if(resp.response.data.length > 0){
                this.saveData(0, resp.response.data, req, res, next, [])
            }
            else{
                this.sendResponse({message:"Discount Module synced successfully"}, res, 200);
            }
        })
    }

    saveData = async(idx,discounts, req, res, next, syncedRows)=>{
        var model = "mDiscounts"
        if(idx<discounts.length){ 
            var  detail = discounts[idx];
            let  exist = await this.readOne({where:{mDiscountId: discounts[idx].mDiscountId, mDiscountStatus:1}}, 'mDiscounts')
            if( exist !== null){
                this.delete('mDiscounts', {mDiscountId:  discounts[idx].mDiscountId}).then(r=>{
                    this.create('mDiscounts', discounts[idx], false).then(async r=>{
                        var pkfield = pkfields[model]
                        syncedRows.push(detail[pkfield])
                        this.saveData(idx+1, discounts, req, res, next,syncedRows)
                    })
                })
            }
            else{
                this.create('mDiscounts', discounts[idx], false).then(async r=>{ 
                    var pkfield = pkfields[model]
                        syncedRows.push(detail[pkfield])
                        this.saveData(idx+1,discounts, req, res, next,syncedRows)
                })
            }
        }
        else{
            var input = { 
                merchantId: req.deviceDetails.merchantId,
                POSId: req.deviceDetails.device.POSId,
                tableRows: syncedRows,
                syncedTable:'mDiscounts'
            }
            this.apiManager.postRequest('/pos/updateSync',  input ,req).then(resp=>{  
                this.sendResponse({message:"Discount Module synced successfully"}, res, 200); 
            }) 
        }
    }
}