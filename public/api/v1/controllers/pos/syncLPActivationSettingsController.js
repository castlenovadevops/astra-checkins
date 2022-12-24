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
    'LPActivationSettings':"id"
}

module.exports = class SyncCategoryController extends baseController{
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
                    path:this.path+"/LPActivationSettings",
                    type:"post",
                    method: "syncLPActivationSettings",
                    authorization:'accessAuth'
                }
            ]
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    } 
    
    syncLPActivationSettings = async(req, res, next)=>{
        let toBeSynced = await this.readAll({where:{syncTable:'LPActivationSettings'}}, 'toBeSynced')
        console.log("SYNC LPActivationSettings::::: ", toBeSynced.length)
        if(toBeSynced.length > 0){  
            this.syncData(0, toBeSynced, req, res, next);
        }
        else{
            this.pullData(req, res, next)
        }
    }

    syncData = async(idx, toBeSynced, req, res, next)=>{
        if(idx < toBeSynced.length ){ 
            console.log("SAVE sync LPActivationSettings CALLED")

            let tobesync = toBeSynced[idx];
            let datares = await this.readOne({where:{
                id: tobesync.tableRowId
            }}, 'LPActivationSettings')
            var data = datares.dataValues
            data["createdDate"] = data["createdDate"].replace("T"," ").replace("Z","");
            // data["updatedDate"] = data["updatedDate"].replace("T"," ").replace("Z","");
            data["addedOn"] = req.deviceDetails.device.POSId || 'POS';
            console.log(data)
            this.apiManager.postRequest('/pos/sync/saveLPActivationSettings', data , req).then(response=>{
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
        this.apiManager.postRequest('/pos/sync/getLPActivationSettings',  input ,req).then(resp=>{ 
            console.log("CATEGORY LENGTH", resp)
            if(resp.response.data.length > 0){
                this.saveData(0, resp.response.data, req, res, next, [])
            }
            else{
                this.sendResponse({message:"LP Settings Module synced successfully"}, res, 200);
            }
        })
    }

    saveData = async(idx,data, req, res, next, syncedRows)=>{
        var model = "LPActivationSettings"
        if(idx<data.length){ 
            var detail = data[idx];
            let detailexist = await this.readOne({where:{id: data[idx].id}}, 'LPActivationSettings')
            if(detailexist !== null){
                this.delete('LPActivationSettings', {id:  data[idx].id}).then(r=>{
                    this.create('LPActivationSettings', data[idx], false).then(async r=>{
                        var pkfield = pkfields[model]
                        syncedRows.push(detail[pkfield])
                        this.saveData(idx+1, data, req, res, next,syncedRows)
                    })
                })
            }
            else{
                this.create('LPActivationSettings', data[idx], false).then(async r=>{ 
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
                syncedTable:'LPActivationSettings'
            }
            this.apiManager.postRequest('/pos/updateSync',  input ,req).then(resp=>{  
                // console.log("SYNC UPDATES CALLED")
                    this.sendResponse({message:"LP Settings Module synced successfully"}, res, 200); 
            }) 
        }
    }
}