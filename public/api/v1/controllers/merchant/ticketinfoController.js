/* eslint-disable no-redeclare */
/* eslint-disable no-useless-constructor */
const baseController = require('../common/baseController');
const MsgController = require('../common/msgController'); 
const express = require('express'); 
const { Sequelize } = require('sequelize');

module.exports = class TicketController extends baseController{
    path = "/merchant/ticket";
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
                    path:this.path+"/getTicketServices",
                    type:"post",
                    method: "getTicketServices",
                    authorization:'accessAuth'
                }, 
                
            ] 
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    } 
    
    getTicketServices = async(req, res)=>{
        var input = req.input
        console.log("$$$$$$$$$$$$")
        try{
        let options = {
            where:{
                ticketId: input.ticketId,
                status:1
            },
            include:[
                {
                    model: this.models.mProducts,
                    required: false, 
                },
                {
                    model: this.models.merchantEmployees,
                    required: false, 
                    attributes:{
                        include:[
    
                            [
                                Sequelize.literal("(select id from mEmployeeCommission where merchantId='"+req.deviceDetails.merchantId+"' and mEmployeeId=`merchantEmployee`.`mEmployeeId` and status=1)"),
                                "mCommissionId"
                            ], 
                            [
                                Sequelize.literal("(select mOwnerPercentage from mEmployeeCommission where merchantId='"+req.deviceDetails.merchantId+"' and mEmployeeId=`merchantEmployee`.`mEmployeeId` and status=1)"),
                                "mOwnerPercentage"
                            ], 
                            [
                                Sequelize.literal("(select mEmployeePercentage from mEmployeeCommission where merchantId='"+req.deviceDetails.merchantId+"' and mEmployeeId=`merchantEmployee`.`mEmployeeId` and status=1)"),
                                "mEmployeePercentage"
                            ],
                            [
                                Sequelize.literal("(select mCashPercentage from mEmployeeCommission where merchantId='"+req.deviceDetails.merchantId+"' and mEmployeeId=`merchantEmployee`.`mEmployeeId` and status=1)"),
                                "mCashPercentage"
                            ],
                            [
                                Sequelize.literal("(select mCheckPercentage from mEmployeeCommission where merchantId='"+req.deviceDetails.merchantId+"' and mEmployeeId=`merchantEmployee`.`mEmployeeId` and status=1)"),
                                "mCheckPercentage"
                            ],
                            [
                                Sequelize.literal("(select mTipsCashPercentage from mEmployeeCommission where merchantId='"+req.deviceDetails.merchantId+"' and mEmployeeId=`merchantEmployee`.`mEmployeeId` and status=1)"),
                                "mTipsCashPercentage"
                            ],
                            [
                                Sequelize.literal("(select mTipsCheckPercentage from mEmployeeCommission where merchantId='"+req.deviceDetails.merchantId+"' and mEmployeeId=`merchantEmployee`.`mEmployeeId` and status=1)"),
                                "mTipsCheckPercentage"
                            ]
                        ]
                    }
                },
                {
                    model: this.models.ticketservicetax,
                    required: false,
                    where:{
                        status:1
                    }
                },
                {
                    model: this.models.ticketservicediscount,
                    required: false,
                    where:{
                        status:1
                    },
                    include:[
                        {
                            model:this.models.mDiscounts,
                            required: false
                        }
                    ]
                }, 
                {
                    model: this.models.ticketTips,
                    required: false,
                    where:{
                        status:1
                    }
                }
            ]
        }

        // let options = {};
        this.readAll(options, 'ticketservices').then(results=>{
            this.sendResponse({data: results}, res, 200)
        })
    }
    catch(e){
        this.sendResponse({data: e}, res, 400)
    }
    }
    
}
