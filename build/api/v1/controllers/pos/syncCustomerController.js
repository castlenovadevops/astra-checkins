/* eslint-disable no-useless-constructor */
const baseController = require('../common/baseController');
const MsgController = require('../common/msgController'); 
const express = require('express'); 
const APIManager = require('../../utils/apiManager'); 

const settings = require('../../config/settings');
let sequelize = settings.database; 
const db = settings.database;

const pkfields = {
    'mTax':"id",
    'mCustomers':"mCustomerId"
}

module.exports = class SyncCustomerController extends baseController{
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
                    path:this.path+"/getCustomers",
                    type:"post",
                    method: "syncCustomers",
                    authorization:'accessAuth'
                }
            ]
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    } 
    
    syncCustomers = async(req, res, next)=>{
        let toBeSynced = await this.readAll({where:{syncTable:'mCustomers'}}, 'toBeSynced')
        if(toBeSynced.length > 0){  
            this.syncData(0, toBeSynced, req, res, next);
        }
        else{
            this.pullData(req, res, next)
        }
    }

    syncData = async(idx, toBeSynced, req, res, next)=>{
        if(idx < toBeSynced.length ){ 
            console.log("SAVE sync Customer CALLED")
            

            let tobesync = toBeSynced[idx];
            let datares = await this.readOne({where:{
                mCustomerId: tobesync.tableRowId
            }}, 'mCustomers')
            var data = datares.dataValues
            data["createdDate"] = data["createdDate"].replace("T"," ").replace("Z","");
            data["updatedDate"] = data["updatedDate"].replace("T"," ").replace("Z","");
            data["addedOn"] = req.deviceDetails.device.POSId || 'POS';
            console.log(data)
            this.apiManager.postRequest('/pos/sync/saveCustomer', data , req).then(response=>{
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
            syncAll: true
        }
        
        this.apiManager.postRequest('/pos/sync/getCustomers',  input ,req).then(resp=>{ 
            console.log("###############")
            console.log(resp.response);
            console.log("$$$$$$$$$$$$$")
            if(resp.response.data.length > 0){
                this.saveData(0, resp.response.data, req, res, next, [])
            }
            else{
                this.sendResponse({message:"Customer Module synced successfully"}, res, 200);
            }
        })
    }

    saveData = async(idx,data, req, res, next, syncedRows)=>{
        var model = "mCustomers"
        if(idx<data.length){ 
            var detail = data[idx];
            let detailexist = await this.readOne({where:{mCustomerId: data[idx].mCustomerId, mCustomerStatus:1}}, 'mCustomers')
            if(detailexist !== null){
                this.delete('mCustomers', {mCustomerId:  data[idx].mCustomerId}).then(r=>{
                    this.create('mCustomers', data[idx], false).then(async r=>{
                        var pkfield = pkfields[model]
                        syncedRows.push(detail[pkfield])
                        this.saveData(idx+1, data, req, res, next,syncedRows)
                    })
                })
            }
            else{
                this.create('mCustomers', data[idx], false).then(async r=>{ 
                    var pkfield = pkfields[model]
                        syncedRows.push(detail[pkfield])
                        this.saveData(idx+1, data, req, res, next,syncedRows)
                })
            }
        }
        else{
            var input = { 
                merchantId: req.deviceDetails.merchantId,
                POSId: req.deviceDetails.device.POSId,
                tableRows: syncedRows,
                syncedTable:'mCustomers'
            }
            this.apiManager.postRequest('/pos/updateSync',  input ,req).then(resp=>{  
                // console.log("SYNC UPDATES CALLED")
                    this.sendResponse({message:"Customer Module synced successfully"}, res, 200); 
            }) 
        }
    }
}