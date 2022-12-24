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
    'LPSettings':"id"
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
                    path:this.path+"/lpsettings",
                    type:"post",
                    method: "syncLPSettings",
                    authorization:'accessAuth'
                }
            ]
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    } 
    
    syncLPSettings = async(req, res, next)=>{
        let toBeSynced = await this.readAll({where:{syncTable:'LPSettings'}}, 'toBeSynced')
        console.log("SYNC LPSEttings::::: ", toBeSynced.length)
        if(toBeSynced.length > 0){  
            this.syncData(0, toBeSynced, req, res, next);
        }
        else{
            this.pullData(req, res, next)
        }
    }

    syncData = async(idx, toBeSynced, req, res, next)=>{
        if(idx < toBeSynced.length ){ 
            console.log("SAVE sync LPSettings CALLED")

            let tobesync = toBeSynced[idx];
            let datares = await this.readOne({where:{
                id: tobesync.tableRowId
            }}, 'LPSettings')
            if(datares !== null){
                var data = datares.dataValues
                data["createdDate"] = data["createdDate"] !== undefined ? data["createdDate"].replace("T"," ").replace("Z","") : '';
                data["updatedDate"] = data["updatedDate"] !== undefined ? data["updatedDate"].replace("T"," ").replace("Z","") : '';
                data["addedOn"] = req.deviceDetails.device.POSId || 'POS';
                console.log(data)
                this.apiManager.postRequest('/pos/sync/saveLPSettings', data , req).then(response=>{
                    this.delete('toBeSynced', {tableRowId: toBeSynced[idx].tableRowId, syncTable: toBeSynced[idx].syncTable}).then(r=>{    
                        this.syncData(idx+1, toBeSynced, req, res, next);
                    })
                }) 
            }
            else{
                this.syncData(idx+1, toBeSynced, req, res, next);
            }
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
        this.apiManager.postRequest('/pos/sync/getLPSettings',  input ,req).then(resp=>{ 
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
        var model = "LPSettings"
        if(idx<data.length){ 
            var detail = data[idx];
            let detailexist = await this.readOne({where:{id: data[idx].id}}, 'LPSettings')
            if(detailexist !== null){
                this.delete('LPSettings', {id:  data[idx].id}).then(r=>{
                    this.create('LPSettings', data[idx], false).then(async r=>{
                        var pkfield = pkfields[model]
                        syncedRows.push(detail[pkfield])
                        this.saveData(idx+1, data, req, res, next,syncedRows)
                    })
                })
            }
            else{
                this.create('LPSettings', data[idx], false).then(async r=>{ 
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
                syncedTable:'LPSettings'
            }
            this.apiManager.postRequest('/pos/updateSync',  input ,req).then(resp=>{  
                // console.log("SYNC UPDATES CALLED")
                    this.sendResponse({message:"LP Settings Module synced successfully"}, res, 200); 
            }) 
        }
    }
}