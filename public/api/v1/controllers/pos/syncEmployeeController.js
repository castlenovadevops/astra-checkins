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
    'merchantEmployees':"mEmployeeId"
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
                    path:this.path+"/employees",
                    type:"post",
                    method: "syncEmployees",
                    authorization:'accessAuth'
                }
            ]
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    } 
    
    syncEmployees = async(req, res, next)=>{ 
        // console.log("SYNC EMPLOYEE CALLED")
        this.pullData(req, res, next) 
    } 

    pullData = async(req, res, next)=>{ 
        
        var input = { 
            merchantId: req.deviceDetails.merchantId,
            POSId: req.deviceDetails.device.POSId,
            // syncAll: true
        }
        // console.log("API CALLING")
        this.apiManager.postRequest('/pos/sync/getEmployees',  input ,req).then(resp=>{ 
            // console.log(resp)
            if(resp.response.data.length > 0){
                this.saveData(0, resp.response.data, req, res, next, [])
            }
            else{
                this.sendResponse({message:"Employees Module synced successfully"}, res, 200);
            }
        })
    }

    saveData = async(idx,data, req, res, next, syncedRows)=>{
        var model = "merchantEmployees"
        if(idx<data.length){ 
            var detail = data[idx];
            let detailexist = await this.readOne({where:{mEmployeeId: data[idx].mEmployeeId }}, 'merchantEmployees')
            if(detailexist !== null){
                // console.log("UPDATEEEEEE", data[idx]);
                this.delete('merchantEmployees', {mEmployeeId:  data[idx].mEmployeeId}).then(r=>{
                    this.create('merchantEmployees', data[idx], false).then(async r=>{
                        this.delete('mEmployeeCommission',{mEmployeeId:detail.mEmployeeId}).then(r=>{
                            this.delete('mEmployeePermissions',{mEmployeeId:detail.mEmployeeId}).then(r=>{
                                this.saveEmpCommission(0, idx, data, model, syncedRows,  req, res, next)
                            });
                        })
                    })
                })
            }
            else{
                // console.log("EEEEEEEEE", data[idx]);
                this.create('merchantEmployees', data[idx], false).then(async r=>{ 
                    var pkfield = pkfields[model]
                        syncedRows.push(detail[pkfield])
                        // this.saveData(idx+1, data, req, res, next,syncedRows)
                        this.saveEmpCommission(0, idx, data, model, syncedRows,  req, res, next)
                })
            }
        }
        else{
            var input = { 
                merchantId: req.deviceDetails.merchantId,
                POSId: req.deviceDetails.device.POSId,
                tableRows: syncedRows,
                syncedTable:'merchantEmployees'
            }
            this.apiManager.postRequest('/pos/updateSync',  input ,req).then(resp=>{  
                    this.sendResponse({message:"Employees Module synced successfully"}, res, 200); 
            }) 
        }
    }

    saveEmpCommission = async (catidx, idx, data, model, syncedRows,  req, res, next)=>{
        var detail = data[idx]
        if(catidx < detail.mEmployeeCommissions.length){
            var catdetail = detail.mEmployeeCommissions[catidx];
            this.create('mEmployeeCommission', catdetail, false).then(r=>{
                this.saveEmpCommission(catidx+1, idx, data, model, syncedRows, req, res, next);
            })
        }
        else{
            this.saveEmpPermissions(0, idx, data, model, syncedRows, req, res, next);
        }
    }

    saveEmpPermissions = async (tidx, idx, data, model, syncedRows,  req, res, next)=>{ 
        var detail = data[idx]
        // console.log(detail)
        if(tidx < detail.mEmployeePermissions.length){
            var taxdetail = detail.mEmployeePermissions[tidx];
            // console.log("$$$$$")
            // console.log(taxdetail)
            this.create('mEmployeePermissions', taxdetail, false).then(r=>{
                this.saveEmpPermissions(tidx+1, idx, data, model, syncedRows, req, res, next);
            })
        }
        else{
            this.completeSync(idx, data, model, syncedRows, req, res, next);
        }
    }

    completeSync = async( idx, data, model, syncedRows, req, res, next)=>{
        var detail = data[idx]
        var pkfield = pkfields[model]
        syncedRows.push(detail[pkfield])
        this.saveData(idx+1, data, req, res, next,syncedRows)
    }
}