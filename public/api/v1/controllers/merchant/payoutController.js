/* eslint-disable no-redeclare */
/* eslint-disable no-useless-constructor */
const baseController = require('../common/baseController');
const MsgController = require('../common/msgController'); 
const express = require('express'); 
const Sequelize = require('sequelize')
const sequelize =  require('../../models').sequelize

module.exports = class PayoutController extends baseController{
    path = "/merchant/payout";
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
                    path:this.path+"/getPayout",
                    type:"post",
                    method: "getPayout",
                    authorization:'accessAuth'
                },  
            ] 
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    }  


    getPayout = async (req, res)=>{
        let options = {
            where:{
                mEmployeeId:{
                    [Sequelize.Op.in]:sequelize.literal("(select technicianId from ticketcommission where status=1)")
                }
            },
            attributes:{
                include:[
                    [
                        Sequelize.col('`merchantEmployees`.`mEmployeeId`'),
                        "id"
                    ],
                    [
                        sequelize.literal("(select sum(servicePrice) from ticketservices where status=1 and ticketServiceId in (select ticketServiceId from ticketservices where status=1 and ticketId in (select ticketId from ticketpayment where ticketId in (select ticketId from tickets where paymentStatus='Paid' ) and Date(createdDate) between Date('"+req.input.from_date.replace("T"," ").replace("Z","")+"') and  Date('"+req.input.to_date.replace("T"," ").replace("Z","")+"'))) and serviceTechnicianId=`merchantEmployees`.`mEmployeeId`  and status=1)"),
                        'TotalServiceAmount'
                    ],
                    [
                        sequelize.literal("(select sum(employeePercentage) from ticketcommission where status=1 and ticketServiceId in (select ticketServiceId from ticketservices where status=1 and ticketId in (select ticketId from ticketpayment where ticketId in (select ticketId from tickets where paymentStatus='Paid' ) and Date(createdDate) between Date('"+req.input.from_date.replace("T"," ").replace("Z","")+"') and  Date('"+req.input.to_date.replace("T"," ").replace("Z","")+"'))) and technicianId=`merchantEmployees`.`mEmployeeId`  and status=1)"),
                        'ServiceAmount'
                    ],
                    [
                        sequelize.literal("(select sum(tipsAmount) from ticketTips where  status=1 and ticketServiceId in (select ticketServiceId from ticketservices where status=1 and ticketId in (select ticketId from ticketpayment where ticketId in (select ticketId from tickets where paymentStatus='Paid' ) and Date(createdDate) between Date('"+req.input.from_date.replace("T"," ").replace("Z","")+"') and  Date('"+req.input.to_date.replace("T"," ").replace("Z","")+"'))) and technicianId=`merchantEmployees`.`mEmployeeId`  and status=1)"),
                        'Tips'
                    ],
                    [
                        sequelize.literal("(select sum(employeePercentage) from ticketservicediscountcommission where  status=1 and ticketServiceId in (select ticketServiceId from ticketservices where status=1 and ticketId in (select ticketId from ticketpayment where ticketId in (select ticketId from tickets where paymentStatus='Paid' ) and Date(createdDate) between Date('"+req.input.from_date.replace("T"," ").replace("Z","")+"') and  Date('"+req.input.to_date.replace("T"," ").replace("Z","")+"'))) and technicianId=`merchantEmployees`.`mEmployeeId`  and status=1)"),
                        'Discount'
                    ],
                    [
                        sequelize.literal("(select sum(employeePercentage) from ticketdiscountcommission where  status=1 and ticketId in (select ticketId from tickets where paymentStatus='Paid' ) and Date(createdDate) between Date('"+req.input.from_date.replace("T"," ").replace("Z","")+"') and  Date('"+req.input.to_date.replace("T"," ").replace("Z","")+"') and technicianId=`merchantEmployees`.`mEmployeeId`  and status=1)"),
                        'TicketDiscount'
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
        }
        this.readAll(options, 'merchantEmployees').then(results=>{
            this.sendResponse({data: results}, res, 200)
        })
    }
}