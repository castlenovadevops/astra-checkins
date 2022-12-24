/* eslint-disable no-useless-constructor */
const baseController = require('../common/baseController');
const MsgController = require('../common/msgController');

const find = require('local-devices');
const express = require('express'); 
const Sequelize = require('sequelize')
const sequelize =  require('../../models').sequelize
module.exports = class CustomerController extends baseController{
    path = "/merchant/customers";
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
                }
            ] 
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
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
                                find().then(devices => { 
                                    devices.forEach(d=>{ 
                                        thisobj.apimanager.postRequest(`http://`+d.ip+":1818/api/v1/merchant/customer/saveCustomerFromCheckin", req.input, req).then(r=>{
                        
                                        })
                                    })
                                  }).catch(e=>{
                                    thisobj.sendResponse({message:"Error"}, res, 400)
                                  })

                                this.create('mCustomers', input).then(async (resp)=>{
                                    if(input.mCustomerLoyaltyPoints !== undefined){
                                        var pointsinput ={
                                            customerId: resp.mCustomerId,
                                            pointsCount: input.mCustomerLoyaltyPoints,
                                            status:'Earned',
                                            dollarValue:'',
                                            createdBy: '',//req.userData.mEmployeeId,
                                            createdDate: this.getDate()
                                        } 
                    
                                        await this.create('customerLoyaltyPoints', pointsinput);
                                    }
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
                            if(input.mCustomerLoyaltyPoints !== undefined){
                                var pointsinput ={
                                    customerId: resp.mCustomerId,
                                    pointsCount: input.mCustomerLoyaltyPoints,
                                    status:'Earned',
                                    dollarValue:'',
                                    createdBy: req.userData.mEmployeeId,
                                    createdDate: this.getDate()
                                } 
            
                                await this.create('customerLoyaltyPoints', pointsinput);
                            }
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