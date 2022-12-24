/* eslint-disable no-useless-constructor */
const baseController = require('../common/baseController');
const MsgController = require('../common/msgController'); 
const express = require('express'); 
const APIManager = require('../../utils/apiManager'); 

const settings = require('../../config/settings');
let sequelize = settings.database; 
const db = settings.database;

const pkfields = {
    'mTax':"id"
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
                    path:this.path+"/tax",
                    type:"post",
                    method: "syncTax",
                    authorization:'accessAuth'
                }
            ]
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    } 
    
    syncTax = async(req, res, next)=>{
        let toBeSynced = await this.readAll({where:{syncTable:'mTax'}}, 'toBeSynced')
        console.log("TO BE SYNCED", toBeSynced.length)
        if(toBeSynced.length > 0){  
            this.syncData(0, toBeSynced, req, res, next);
        }
        else{
            this.pullData(req, res, next)
        }
    }

    syncData = async(idx, toBeSynced, req, res, next)=>{
        if(idx < toBeSynced.length ){ 
            console.log("SAVE TAX CALLED")
            let tobesync = toBeSynced[idx];
            let datares = await this.readOne({where:{
                id: tobesync.tableRowId
            }}, 'mTax')
            var data = datares.dataValues
            data["createdDate"] = data["createdDate"].replace("T"," ").replace("Z","");
            data["updatedDate"] = data["updatedDate"].replace("T"," ").replace("Z","");
            data["addedOn"] = req.deviceDetails.device.POSId || 'POS';
            console.log(data)
            this.apiManager.postRequest('/pos/sync/saveTax', data , req).then(response=>{
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
        this.apiManager.postRequest('/pos/sync/getTax',  input ,req).then(resp=>{ 
            if(resp.response.data.length > 0){
                this.saveData(0, resp.response.data, req, res, next, [])
            }
            else{
                this.sendResponse({message:"Tax Module synced successfully"}, res, 200);
            }
        })
    }

    saveData = async(idx,taxes, req, res, next, syncedRows)=>{
        var model = "mTax"
        if(idx<taxes.length){ 
            var taxdetail = taxes[idx];
            let taxexist = await this.readOne({where:{mTaxId: taxes[idx].mTaxId, mTaxStatus:1}}, 'mTax')
            if(taxexist !== null){
                this.delete('mTax', {mTaxId:  taxes[idx].mTaxId}).then(r=>{
                    this.create('mTax', taxes[idx], false).then(async r=>{
                        var pkfield = pkfields[model]
                        syncedRows.push(taxdetail[pkfield])
                        this.saveData(idx+1, taxes, req, res, next,syncedRows)
                    })
                })
            }
            else{
                this.create('mTax', taxes[idx], false).then(async r=>{ 
                    var pkfield = pkfields[model]
                        syncedRows.push(taxdetail[pkfield])
                        this.saveData(idx+1, taxes, req, res, next,syncedRows)
                })
            }
        }
        else{
            var input = { 
                merchantId: req.deviceDetails.merchantId,
                POSId: req.deviceDetails.device.POSId,
                tableRows: syncedRows,
                syncedTable:'mTax'
            }
            this.apiManager.postRequest('/pos/updateSync',  input ,req).then(resp=>{  
                this.sendResponse({message:"Tax Module synced successfully"}, res, 200); 
            }) 
        }
    }
}