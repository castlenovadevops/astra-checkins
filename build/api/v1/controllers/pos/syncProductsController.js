/* eslint-disable no-useless-constructor */
const baseController = require('../common/baseController');
const MsgController = require('../common/msgController'); 
const express = require('express'); 
const APIManager = require('../../utils/apiManager'); 
const Sequelize = require('sequelize')
const settings = require('../../config/settings');
let sequelize = settings.database; 
const db = settings.database;

const pkfields = {
    'mTax':"id",
    'mProducts':"id"
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
                    path:this.path+"/products",
                    type:"post",
                    method: "syncProducts",
                    authorization:'accessAuth'
                }
            ]
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    } 
    
    syncProducts = async(req, res, next)=>{
        let toBeSynced = await this.readAll({where:{syncTable:'mProducts'}}, 'toBeSynced')
        if(toBeSynced.length > 0){  
            this.syncData(0, toBeSynced, req, res, next);
        }
        else{
            this.pullData(req, res, next)
        }
    }

    syncData = async(idx, toBeSynced, req, res, next)=>{
        if(idx < toBeSynced.length ){ 
            console.log("SAVE sync Products CALLED", toBeSynced.length)
            let detail = await this.readOne({
                order: [
                    ['createdDate','ASC']
                ],
                where:{
                    id: toBeSynced[idx].tableRowId ,  
                },
                include:[
                    {
                        model:this.models.mProductCategory, 
                        where:{
                            status:1, 
                        },
                        required: false
                    },
                    {
                        model:this.models.mProductTax, 
                        where:{
                            status:1
                        },
                        required: false
                    }
                ]
                
            }, 'mProducts')
            var product = detail || detail.dataValues; 
            console.log(product)
            product["createdDate"] = product["createdDate"].replace("T"," ").replace("Z","");
            product["updatedDate"] = product["updatedDate"].replace("T"," ").replace("Z","");
            product["addedOn"] = req.deviceDetails.device.POSId || 'POS';
            this.apiManager.postRequest('/pos/sync/saveProduct',  product, req).then(response=>{
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
        this.apiManager.postRequest('/pos/sync/getProducts',  input ,req).then(resp=>{ 
            console.log("PRODUCTS ", resp.response.data.length)
            if(resp.response.data.length > 0){
                this.saveData(0, resp.response.data, req, res, next, [])
            }
            else{
                this.sendResponse({message:"Products Module synced successfully"}, res, 200);
            }
        })
    }

    saveData = async(idx,data, req, res, next, syncedRows)=>{
        var model = "mProducts"
        if(idx<data.length){ 
            var detail = data[idx];
            let detailexist = await this.readOne({where:{mProductId: data[idx].mProductId, mProductStatus:1}}, 'mProducts')
            if(detailexist !== null){
                this.delete('mProducts', {mProductId:  data[idx].mProductId}).then(r=>{
                    this.create('mProducts', data[idx], false).then(async r=>{
                        this.delete('mProductCategory',{mProductId:detail.mProductId}).then(r=>{
                            this.delete('mProductTax',{mProductId:detail.mProductId}).then(r=>{
                                this.saveProductCategory(0, idx, data, model, syncedRows,  req, res, next)
                            });
                        })
                    })
                })
            }
            else{
                this.create('mProducts', data[idx], false).then(async r=>{ 
                    var pkfield = pkfields[model]
                        syncedRows.push(detail[pkfield])
                        // this.saveData(idx+1, data, req, res, next,syncedRows)
                        this.saveProductCategory(0, idx, data, model, syncedRows,  req, res, next)
                })
            }
        }
        else{
            var input = { 
                merchantId: req.deviceDetails.merchantId,
                POSId: req.deviceDetails.device.POSId,
                tableRows: syncedRows,
                syncedTable:'mProducts'
            }
            this.apiManager.postRequest('/pos/updateSync',  input ,req).then(resp=>{  
                    this.sendResponse({message:"Products Module synced successfully"}, res, 200); 
            }) 
        }
    }

    saveProductCategory = async (catidx, idx, data, model, syncedRows,  req, res, next)=>{
        var detail = data[idx]
        if(catidx < detail.mProductCategories.length){
            var catdetail = detail.mProductCategories[catidx];
            this.create('mProductCategory', catdetail, false).then(r=>{
                this.saveProductCategory(catidx+1, idx, data, model, syncedRows, req, res, next);
            })
        }
        else{
            this.saveProductTax(0, idx, data, model, syncedRows, req, res, next);
        }
    }

    saveProductTax = async (tidx, idx, data, model, syncedRows,  req, res, next)=>{ 
        var detail = data[idx]
        if(tidx < detail.mProductTaxes.length){
            var taxdetail = detail.mProductTaxes[tidx]; 
            this.create('mProductTax', taxdetail, false).then(r=>{
                this.saveProductTax(tidx+1, idx, data, model, syncedRows, req, res, next);
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