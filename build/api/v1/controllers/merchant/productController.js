const baseController = require('../common/baseController');
const MsgController = require('../common/msgController');

const express = require('express');
const authenticate = require('../../middleware/index'); 
const Sequelize = require('sequelize')
const sequelize =  require('../../models').sequelize
module.exports = class ProductController extends baseController{
    path = "/merchant/product";
    router = express.Router();
    msgController = new MsgController();
    routes = []
    constructor(props){
        super(props);
    }

    initialize(){ 
        return new Promise((resolve) => {
            this.routes = [
                {
                    path:this.path+"/save",
                    type:"post",
                    method: "save",
                    authorization:'accessAuth'
                },
                {
                    path:this.path+"/get",
                    type:"post",
                    method: "get",
                    authorization:'accessAuth'
                },
                {
                    path:this.path+"/getbyCategory",
                    type:"post",
                    method: "getByCategory",
                    authorization:'accessAuth'
                },
                {
                    path:this.path+"/update",
                    type:"post",
                    method: "updateProduct",
                    authorization:'accessAuth'
                }
            ]
            // this.router.post(this.path+"/save", authenticate.authorizationAuth, this.save); 
            // this.router.get(this.path+"/get", authenticate.authorizationAuth, this.get); 
            // this.router.post(this.path+"/update", authenticate.authorizationAuth, this.updateProduct); 
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    } 

    save = async(req,res,next)=>{
        var input = Object.assign({}, req.input);
        input.merchantId = req.deviceDetails.merchantId;
        input.mProductStatus = '1';
        input.createdBy= req.userData.mEmployeeId;
        input.createdDate = this.getDate();

        input.updatedBy= req.userData.mEmployeeId;
        input.updatedDate = this.getDate();
        console.log("PRODUCT SAVE CALLED")
        console.log(input)
        delete input["mProductCategories"];
        delete input["mProductTaxes"]
        if(input.id !== undefined){
            this.updateWithNew('mProducts', input, {where:{id :input.id}},'mProductStatus', 'id').then(resp=>{
                this.update('mProductCategory',{status:0, updatedBy: req.userData.mEmployeeId, updatedDate: this.getDate()}, {where:{mProductId: input.mProductId}}).then(r=>{ 
                    this.update('mProductTax',{status:0, updatedBy: req.userData.mEmployeeId, updatedDate: this.getDate()}, {where:{mProductId: input.mProductId}}).then(r=>{
                        this.saveCategory(0, input.mProductId, req, res, next);
                    })
                })
            })
        }
        else{ 
            if(input.mProductSKU!== undefined && input.mProductSKU !== ''){ 
                var productdetail = await this.readAll({where:{mProductSKU: input.mProductSKU, merchantId: req.deviceDetails.merchantId }}, 'mProducts')
                
                if(productdetail.length > 0){
                    return this.sendResponse({message: this.mproductSkuexists, field:'mProductSKU'}, res, 400);
                } 
            }
            if(input.mProductCode!== undefined && input.mProductCode !== ''){
                var productdetail = await this.readAll({where:{mProductCode: input.mProductCode, merchantId: req.deviceDetails.merchantId }}, 'mProducts')
                
                if(productdetail.length > 0){
                   return this.sendResponse({message: this.mproductcodeexists, field:'mProductCode'}, res, 400);
                } 
            }
            this.create('mProducts', input).then(resp=>{
                this.saveCategory(0, resp.mProductId, req, res, next);
            })
        }
    }

    saveCategory = async(idx, productid, req, res,next)=>{
        var input = req.input;
        var categories = Object.assign([], input.mProductCategories)
        if(idx<categories.length){
            var cinput ={
                mProductId: productid,
                mCategoryId: categories[idx],
                status:1,
                createdBy: req.userData.mEmployeeId,
                createdDate: this.getDate()
            }
            this.create('mProductCategory', cinput).then(r=>{
                this.saveCategory(idx+1, productid, req, res, next);
            })
        }
        else{
            this.saveTaxes(0, productid, req, res, next)
        }
    }

    saveTaxes = async(idx, productid, req, res, next)=>{
        var input = req.input;
        var taxes =  Object.assign([], input.mProductTaxes)
        if(idx<taxes.length){
            var cinput ={
                mProductId: productid,
                mTaxId: taxes[idx],
                status:1,
                createdBy: req.userData.mEmployeeId,
                createdDate: this.getDate()
            }
            this.create('mProductTax', cinput).then(r=>{
                this.saveTaxes(idx+1, productid, req, res, next);
            })
        }
        else{
            this.sendResponse({message:"Saved sucessfully"}, res, 200)
        }
    }

    get = async (req,res,next)=>{ 
        let products = await this.readAll({
            order: [
                ['createdDate','ASC']
            ],
            where:{
                merchantId: req.deviceDetails.merchantId,
                mProductStatus:{
                    [Sequelize.Op.ne]:'2'
                }
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
        this.sendResponse({ data: products}, res, 200);
    }

    getByCategory = async (req,res,next)=>{ 
        let products = await this.readAll({
            order: [
                ['createdDate','ASC']
            ],
            where:{
                merchantId: req.deviceDetails.merchantId,
                mProductStatus:{
                    [Sequelize.Op.ne]:'2'
                },
                mProductId:{
                    [Sequelize.Op.in]:sequelize.literal("(select mProductId from mProductCategory where mCategoryId='"+req.input.categoryId+"' and status=1)")
                }
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
                    attributes:{
                        include:[
                            [
                                sequelize.literal("(select mTaxName from mTax where mTaxId=`mProductTaxes`.`mTaxId`)"),
                                "mTaxName"
                            ], 
                            [
                                sequelize.literal("(select mTaxType from mTax where mTaxId=`mProductTaxes`.`mTaxId`)"),
                                "mTaxType"
                            ],
                            [
                                sequelize.literal("(select mTaxValue from mTax where mTaxId=`mProductTaxes`.`mTaxId`)"),
                                "mTaxValue"
                            ]
                        ]
                    },
                    where:{
                        status:1
                    },
                    required: false
                }
            ]
            
        }, 'mProducts')
        this.sendResponse({ data: products}, res, 200);
    }

    updateProduct = async(req, res,next)=>{ 
        const input = req.input; 
        const user = req.userData;  
        // console.log(input)
        var data = {
            mProductStatus: input.mProductStatus,
            updatedBy: user.id,
            updatedDate: this.getDate()
        }
        this.update('mProducts', data, {where:{mProductId:input.id}}).then(r1=>{
            this.sendResponse({message:"Product/Service details updated successfully."}, res, 200);
        })
    }

}