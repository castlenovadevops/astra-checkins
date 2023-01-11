/* eslint-disable no-useless-constructor */
const baseController = require('../common/baseController');
const MsgController = require('../common/msgController');

const find = require('local-devices');
const express = require('express'); 
const Sequelize = require('sequelize')
const sequelize =  require('../../models').sequelize
const APIManager = require('../../utils/apiManager');

module.exports = class CustomerController extends baseController{
    path = "/merchant/customers";
    apimanager = new APIManager();
    router = express.Router();
    msgController = new MsgController();
    routes=[];
    constructor(props){
        super(props);
    }

    initialize(){ 
        return new Promise((resolve) => {
            this.routes = [
                {
                    path:this.path+"/getActive", 
                    type:"post",
                    method: "getActiveProducts",
                    authorization:'accessAuth'
                },
                {
                    path:this.path+"/getCustomer",
                    type:"post",
                    method: "getCustomer",
                    authorization:'accessAuth'
                }, 
                {
                    path:this.path+"/getActiveCustomer",
                    type:"post",
                    method: "getActiveCustomer",
                    authorization:'accessAuth'
                }, 
                {
                    path:this.path+"/save",
                    type:"post",
                    method: "saveCustomer",
                    authorization:'accessAuth'
                }, 
                {
                    path:this.path+"/updateCustomer",
                    type:"post",
                    method: "updateCustomer",
                    authorization:'accessAuth'
                }, 
                {
                    path:this.path+"/searchByMobile",
                    type:"post",
                    method: "searchByMobile",
                    authorization:'accessAuth'
                }, 
                {
                    path:this.path+"/searchByName",
                    type:"post",
                    method: "searchByName",
                    authorization:'accessAuth'
                }, 
                {
                    path:this.path+"/searchByMobileLast",
                    type:"post",
                    method: "searchByMobileLast",
                    authorization:'accessAuth'
                }
            ] 
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    } 

    getActiveProducts = async (req,res,next)=>{ 
        let products = await this.readAll({
            order: [
                ['createdDate','ASC']
            ],
            where:{
                merchantId: req.deviceDetails.merchantId,
                mProductStatus: '1',
                mProductId:{
                    [Sequelize.Op.in]:sequelize.literal("(select mProductId from mProductCategory where mCategoryId in (select mCategoryId from mCategory where mCategoryStatus='1') and status=1)")
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
                        status:1,
                        mTaxId:{
                            [Sequelize.Op.in]: sequelize.literal("(select mTaxId from mTax where mTaxStatus=1)")
                        }
                    },
                    required: false
                }
            ]
            
        }, 'mProducts')
        this.sendResponse({ data: products}, res, 200);
    }

    searchByMobileLast = async(req, res, next) =>{
        var input = req.input;
        this.readAll({where:{mCustomerMobile: {
            [Sequelize.Op.like]:'%'+input.value
        }}}, 'mCustomers').then(r=>{
            if(r.length > 0){
                this.sendResponse({data: r}, res, 200)
            }
            else{
                this.sendResponse({message:"This mobile number not exists."}, res, 400)
            }
        })
    }


    searchByName = async(req, res, next) =>{
        var input = req.input;
        this.readAll({where:{mCustomerName: {
            [Sequelize.Op.like]:'%'+input.value+'%'
        }}}, 'mCustomers').then(r=>{
            if(r.length > 0){
                this.sendResponse({data: r}, res, 200)
            }
            else{
                this.sendResponse({message:"This mobile number not exists."}, res, 400)
            }
        })
    }
    searchByMobile = async(req, res, next) =>{
        var input = req.input;
        this.readAll({where:{mCustomerMobile: input.value}}, 'mCustomers').then(r=>{
            if(r.length > 0){
                this.sendResponse({data: r[0]}, res, 200)
            }
            else{
                this.sendResponse({message:"This mobile number not exists."}, res, 200)
            }
        })
    }

    saveCustomer = async(req,res,next)=>{
        var input = req.input;
        input.merchantId = req.deviceDetails.merchantId;
        input.mCustomerStatus = 1;
        input.createdBy= '';//req.userData.mEmployeeId ;
        input.createdDate = this.getDate();

        input.updatedBy= '';//req.userData.mEmployeeId;
        input.updatedDate = this.getDate();
        console.log("UPDATE CALLED")
        console.log(input)
        if(input.id !== undefined){
            input["mCustomerId"] = input.id;
            this.update('mCustomers', input, {where:{mCustomerId :input.id}}).then(resp=>{
                this.sendResponse({message:"Updated sucessfully"}, res, 200)
            })
        }
        else{
            this.readAll({where:{mCustomerMobile: input.mCustomerMobile}}, 'mCustomers').then(exist=>{
                if(exist.length === 0){ 
                    var thisobj = this;
                    if(input.mCustomerMemberId.trim() !== ''){
                        this.readAll({where:{mCustomerMemberId: input.mCustomerMemberId}}, 'mCustomers').then(exmem=>{
                            if(exmem.length === 0){ 

                                this.create('mCustomers', input).then(async (resp)=>{ 

                                    find().then(devices => {  
                                        devices.forEach(d=>{  
                                            thisobj.apimanager.postRequest(`http://`+d.ip+":1818/api/v1/merchant/customers/saveCustomerFromCheckin", resp.dataValues || resp, req).then(r=>{
                                                console.log(r)
                                            })
                                        })
                                    }).catch(e=>{ 
                                        console.log(e)
                                    })
                                    this.sendResponse({message:"Saved sucessfully", data:resp}, res, 200)
                                })
                            }
                            else{
                                this.sendResponse({message:"This member id already exist.", field:'mCustomerMemberId'}, res, 400)
                            }
                        })
                    }
                    else{

                        this.create('mCustomers', input).then(async (resp)=>{

                            find().then(devices => {  
                                devices.forEach(d=>{  
                                    thisobj.apimanager.postRequest(`http://`+d.ip+":1818/api/v1/merchant/customers/saveCustomerFromCheckin", resp.dataValues || resp, req).then(r=>{
                                        console.log(r)
                                    })
                                })
                            }).catch(e=>{ 
                                console.log(e)
                            })
                            this.sendResponse({message:"Saved sucessfully", data:resp}, res, 200)
                        })
                    }
                }
                else{
                    this.sendResponse({message:"This mobile number already exist.", field:'mCustomerMobile'}, res, 400)
                }
            })
        }
    }

    getActiveCustomer = async (req,res,next)=>{ 
        let customers = await this.readAll({order: [
            ['createdDate','ASC']
        ],
        attributes:{include: [ [
                Sequelize.col('mCustomerId'),
                `id`
            ], 
            [
                sequelize.literal("(select  SUM(Earned)-SUM(Redeemed) FROM ( select pointsCount as Earned, 0 as Redeemed From customerLoyaltyPoints where status='Earned' and customerId=`mCustomers`.`mCustomerId` union all select 0 as Earned, pointsCount as Redeemed From customerLoyaltyPoints where status='Redeemed' and customerId=`mCustomers`.`mCustomerId` ) )"),
                // sequelize.literal("(select sum(pointsCount) from customerLoyaltyPoints where status='Earned' and customerId=`mCustomers`.`mCustomerId`)"),
                "mCustomerLoyaltyPoints"
            ] , 
            [
                sequelize.literal("(select  SUM(Earned)-SUM(Redeemed) FROM ( select pointsCount as Earned, 0 as Redeemed From customerLoyaltyPoints where status='Earned' and customerId=`mCustomers`.`mCustomerId` union all select 0 as Earned, pointsCount as Redeemed From customerLoyaltyPoints where status='Redeemed' and customerId=`mCustomers`.`mCustomerId` ) )"),
                // sequelize.literal("(select sum(pointsCount) from customerLoyaltyPoints where status='Earned' and customerId=`mCustomers`.`mCustomerId`)"),
                "LoyaltyPoints"
            ]
        ]},
        where:{
            merchantId:req.deviceDetails.merchantId,
            mCustomerStatus:1
        }
        }, 'mCustomers')
        this.sendResponse({ data: customers}, res, 200);
    }
    getCustomer = async (req,res,next)=>{ 
        let customers = await this.readAll({order: [
            ['createdDate','ASC']
        ],
        attributes:{include: [ [
                    Sequelize.col('mCustomerId'),
                    `id`
                ], 
                [
                    sequelize.literal("(select  SUM(Earned)-SUM(Redeemed) FROM ( select pointsCount as Earned, 0 as Redeemed From customerLoyaltyPoints where status='Earned' and customerId=`mCustomers`.`mCustomerId` union all select 0 as Earned, pointsCount as Redeemed From customerLoyaltyPoints where status='Redeemed' and customerId=`mCustomers`.`mCustomerId` ) )"),
                    // sequelize.literal("(select sum(pointsCount) from customerLoyaltyPoints where status='Earned' and customerId=`mCustomers`.`mCustomerId`)"),
                    "mCustomerLoyaltyPoints"
                ], 
                [
                    sequelize.literal("(select  SUM(Earned)-SUM(Redeemed) FROM ( select pointsCount as Earned, 0 as Redeemed From customerLoyaltyPoints where status='Earned' and customerId=`mCustomers`.`mCustomerId` union all select 0 as Earned, pointsCount as Redeemed From customerLoyaltyPoints where status='Redeemed' and customerId=`mCustomers`.`mCustomerId` ) )"),
                    // sequelize.literal("(select sum(pointsCount) from customerLoyaltyPoints where status='Earned' and customerId=`mCustomers`.`mCustomerId`)"),
                    "LoyaltyPoints"
                ]
            ]},
        where:{
            merchantId:req.deviceDetails.merchantId
        }
        }, 'mCustomers')
        this.sendResponse({ data: customers}, res, 200);
    }

    updateCustomer = async(req, res,next)=>{ 
        const input = req.input; 
        const user = req.userData;  
        var data = {
            mCustomerStatus: input.mCustomerStatus,
            updatedBy: user.mEmployeeId,
            updatedDate: this.getDate()
        }
        this.update('mCustomers', data, {where:{mCustomerId:input.id}}).then(r1=>{
            this.sendResponse({message:"Customer details updated successfully."}, res, 200);
        })
    }

}