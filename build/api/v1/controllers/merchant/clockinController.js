/* eslint-disable no-redeclare */
/* eslint-disable no-useless-constructor */
const baseController = require('../common/baseController');
const MsgController = require('../common/msgController');

const jwt = require("jsonwebtoken");
const  {jwtOptions} = require('../../config/jwtOptions')
const express = require('express');
const authenticate = require('../../middleware/index');  
const Sequelize = require('sequelize')
const sequelize =  require('../../models').sequelize

const { result } = require('lodash');
module.exports = class ClockInController extends baseController{
    path = "/merchant/employee";
    router = express.Router();
    msgController = new MsgController();
    routes =[];
    constructor(props){
        super(props);
    }

    initialize(){ 
        return new Promise((resolve) => {
            this.routes = [
                {
                    path:this.path+"/clocklog",
                    type:"post",
                    method: "clocklogUpdate",
                    authorization:'accessAuth'
                }, 
                {
                    path:this.path+"/getTechnicians",
                    type:"post",
                    method: "getTechnicians",
                    authorization:'accessAuth'
                }
            ]
            // this.router.post(this.path+"/save", authenticate.accessAuth, this.saveCustomer); 
            // this.router.get(this.path+"/getMerchants", authenticate.authorizationAuth, this.getMerchants); 
            // this.router.post(this.path+"/save", authenticate.authorizationAuth, this.save); 
            // this.router.get(this.path+"/get", authenticate.authorizationAuth, this.get); 
            // this.router.get(this.path+"/getAll", authenticate.authorizationAuth, this.getAll); 
            // this.router.post(this.path+"/update", authenticate.authorizationAuth, this.updateEmployee); 
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    } 


    clocklogUpdate= async(req, res, next)=>{
        var passcode = req.input.passCode;
        this.readOne({where:{mEmployeePasscode: passcode}}, 'merchantEmployees').then(results=>{
            if(results !== null){
                var detail = results.dataValues || results
                this.readOne({where:{mEmployeeId: detail.mEmployeeId, status:1}}, 'empLog').then(logres=>{
                    if(logres !== null){ 
                        let loginput = { 
                            status:2,
                            clockedOutOn: this.getDate()
                        }
                        this.update('empLog', loginput, {where:{mEmployeeId: detail.mEmployeeId, status:1}} ,true).then(results=>{
                            this.sendResponse({message:"Clocked-Out successfully."}, res, 200)
                        })
                    }
                    else{
                        let loginput = {
                            mEmployeeId:detail.mEmployeeId,
                            clockedInOn: this.getDate(),
                            status:1,
                            clockedOutOn:''
                        }
                        this.create('empLog', loginput, true).then(results=>{
                            this.sendResponse({message:"Clocked-In successfully."}, res, 200)
                        })
                    }
                })
            }
            else{
                this.sendResponse({message:"Invalid passcode. Please try again later"}, res, 400);
            }
        })
    }


    getTechnicians = async(req, res, next)=>{
        var input = req.input;
        var options = {
            where:{
                mEmployeeId:{
                    [Sequelize.Op.notIn]:sequelize.literal("(select mEmployeeId from empLog where status=1)")
                }
            },
        }
        if(input.type === 'clockedin'){
            options = {
                where:{
                    mEmployeeId:{
                        [Sequelize.Op.in]:sequelize.literal("(select mEmployeeId from empLog where status=1)")
                    }
                }, 
            }
        }

        options.attributes = {
            include:[
                [
                    Sequelize.col('mEmployeeId'),
                    'id'
                ],
                [
                    sequelize.literal("(select id from mEmployeeCommission where merchantId='"+req.deviceDetails.merchantId+"' and mEmployeeId=`merchantEmployees`.`mEmployeeId` and status=1)"),
                    "mCommissionId"
                ], 
                [
                    sequelize.literal("(select mOwnerPercentage from mEmployeeCommission where merchantId='"+req.deviceDetails.merchantId+"' and mEmployeeId=`merchantEmployees`.`mEmployeeId` and status=1)"),
                    "mOwnerPercentage"
                ], 
                [
                    sequelize.literal("(select mEmployeePercentage from mEmployeeCommission where merchantId='"+req.deviceDetails.merchantId+"' and mEmployeeId=`merchantEmployees`.`mEmployeeId` and status=1)"),
                    "mEmployeePercentage"
                ],
                [
                    sequelize.literal("(select mCashPercentage from mEmployeeCommission where merchantId='"+req.deviceDetails.merchantId+"' and mEmployeeId=`merchantEmployees`.`mEmployeeId` and status=1)"),
                    "mCashPercentage"
                ],
                [
                    sequelize.literal("(select mCheckPercentage from mEmployeeCommission where merchantId='"+req.deviceDetails.merchantId+"' and mEmployeeId=`merchantEmployees`.`mEmployeeId` and status=1)"),
                    "mCheckPercentage"
                ],
                [
                    sequelize.literal("(select mTipsCashPercentage from mEmployeeCommission where merchantId='"+req.deviceDetails.merchantId+"' and mEmployeeId=`merchantEmployees`.`mEmployeeId` and status=1)"),
                    "mTipsCashPercentage"
                ],
                [
                    sequelize.literal("(select mTipsCheckPercentage from mEmployeeCommission where merchantId='"+req.deviceDetails.merchantId+"' and mEmployeeId=`merchantEmployees`.`mEmployeeId` and status=1)"),
                    "mTipsCheckPercentage"
                ]
            ]
        }

        console.log(options)

        this.readAll(options, 'merchantEmployees').then(results=>{
            this.sendResponse({data: results}, res, 200)
        }).catch(e=>{
            console.log(e)
        })
    }

}