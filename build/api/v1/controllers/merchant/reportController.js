/* eslint-disable no-redeclare */
/* eslint-disable no-useless-constructor */
const baseController = require('../common/baseController');
const MsgController = require('../common/msgController'); 
const express = require('express'); 
const Sequelize = require('sequelize')
const sequelize =  require('../../models').sequelize

module.exports = class reportController extends baseController{
    path = "/merchant/report";
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
                    path:this.path+"/getReport",
                    type:"post",
                    method: "getReport",
                    authorization:'accessAuth'
                },  
                {
                    path:this.path+"/getEmpReport",
                    type:"post",
                    method: "getEmpReport",
                    authorization:'accessAuth'
                },  
            ] 
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    }  


//     getReport = async (req, res)=>{ 
//         var owner = await this.readOne({where:{mEmployeeRoleName:'Owner'}}, 'merchantEmployees');
        

//         var groupoptions = {
//             group: [
//                 [sequelize.literal('"created"'), 'ASC']
//             ],
//             // where:{

//             // } 
//             attributes:[
//                 // [ sequelize.literal("select strftime('%m-%Y', createdDate) from tickets where ticketId=`tickets`.`ticketId`"),'created']
//                 [Sequelize.fn('sum', Sequelize.col('ticketTotalAmount')), 'tickettotal'],
//                 // [Sequelize.fn('date_trunc', 'day', Sequelize.col('createdAt')), 'createdOn'],
//                 [Sequelize.fn('strftime','%m-%Y', Sequelize.col('createdDate')), 'created'],
//             ]
//         }

//         const results = await this.readAll(groupoptions, 'tickets')
// console.log("$$$%%$$$$$$$")
//         console.log(results);

//         this.sendResponse({owner: owner, results: results}, res, 200);

//         // var query = `(select ticketId from tickets where strftime("%d-%m-%Y", createdDate) = strftime("%d-%m-%Y", Date.now()))`;
//         // if(req.input.reportPeriod === 'monthly'){
//         //     query = `(select ticketId from tickets where strftime("%m-%Y", createdDate) = strftime("%m-%Y", Date.now()))`;
//         // }
//         // if(req.input.reportPeriod === 'yearly'){
//         //     query = `(select ticketId from tickets where strftime("%Y", createdDate) = strftime("%Y", Date.now()))`;
//         // }
//         // let ticketoptions = {
//         //     where:{
//         //         ticketId:{
//         //             [Sequelize.Op.in]:sequelize.literal(query)
//         //         }
//         //     }
//         // }
//         // const ticketres = await this.readAll(ticketoptions, 'tickets');
//         // const ticketids = await ticketres.forEach(t=>t.ticketId)

//         // let ticketserviceoptions = {
//         //     where:{
//         //         ticketId:{
//         //             [Sequelize.Op.in]:sequelize.literal(query)
//         //         }
//         //     }
//         // }
//         // console.log("############")
//         // console.log(req.input)

//         // // const ticketserviceres = await this.readAll(ticketserviceoptions, 'ticketservices');
//         // // const ticketserviceids = await ticketres.forEach(t=>t.ticketServiceId);
//         // var options = {
//         //     where:{
//         //         mEmployeeRoleName:'Owner'
//         //     },
//         //     attributes:{
//         //         include:[ 
//         //         [
//         //             sequelize.literal("(select sum(servicePerUnitCost*serviceQty) from ticketservices where ticketServiceId in (select ticketServiceId from ticketservices where ticketId in (select ticketId from ticketpayment where ticketId in (select ticketId from tickets where paymentStatus='Paid' ) and Date(createdDate) between Date('"+req.input.from_date.replace("T"," ").replace("Z","")+"') and  Date('"+req.input.to_date.replace("T"," ").replace("Z","")+"'))) and serviceTechnicianId=`merchantEmployees`.`mEmployeeId`  and status=1)"),
//         //             'TotalServiceAmount'
//         //         ],
//         //         [
//         //             sequelize.literal("(select sum(employeePercentage) from ticketcommission where ticketServiceId in (select ticketServiceId from ticketservices where ticketId in (select ticketId from ticketpayment where ticketId in (select ticketId from tickets where paymentStatus='Paid' ) and Date(createdDate) between Date('"+req.input.from_date.replace("T"," ").replace("Z","")+"') and  Date('"+req.input.to_date.replace("T"," ").replace("Z","")+"'))) and technicianId=`merchantEmployees`.`mEmployeeId`  and status=1)"),
//         //             'ServiceAmount'
//         //         ],
//         //         [
//         //             sequelize.literal("(select sum(tipsAmount) from ticketTips where ticketServiceId in (select ticketServiceId from ticketservices where ticketId in (select ticketId from ticketpayment where ticketId in (select ticketId from tickets where paymentStatus='Paid' ) and Date(createdDate) between Date('"+req.input.from_date.replace("T"," ").replace("Z","")+"') and  Date('"+req.input.to_date.replace("T"," ").replace("Z","")+"'))) and technicianId=`merchantEmployees`.`mEmployeeId`  and status=1)"),
//         //             'Tips'
//         //         ],
//         //         [
//         //             sequelize.literal("(select sum(employeePercentage) from ticketservicediscountcommission where ticketServiceId in (select ticketServiceId from ticketservices where ticketId in (select ticketId from ticketpayment where ticketId in (select ticketId from tickets where paymentStatus='Paid' ) and Date(createdDate) between Date('"+req.input.from_date.replace("T"," ").replace("Z","")+"') and  Date('"+req.input.to_date.replace("T"," ").replace("Z","")+"'))) and technicianId=`merchantEmployees`.`mEmployeeId`  and status=1)"),
//         //             'Discount'
//         //         ],[
//         //             sequelize.literal("(select id from mEmployeeCommission where merchantId='"+req.deviceDetails.merchantId+"' and mEmployeeId=`merchantEmployees`.`mEmployeeId`)"),
//         //             "mCommissionId"
//         //         ], 
//         //         [
//         //             sequelize.literal("(select mOwnerPercentage from mEmployeeCommission where merchantId='"+req.deviceDetails.merchantId+"' and mEmployeeId=`merchantEmployees`.`mEmployeeId`)"),
//         //             "mOwnerPercentage"
//         //         ], 
//         //         [
//         //             sequelize.literal("(select mEmployeePercentage from mEmployeeCommission where merchantId='"+req.deviceDetails.merchantId+"' and mEmployeeId=`merchantEmployees`.`mEmployeeId`)"),
//         //             "mEmployeePercentage"
//         //         ],
//         //         [
//         //             sequelize.literal("(select mCashPercentage from mEmployeeCommission where merchantId='"+req.deviceDetails.merchantId+"' and mEmployeeId=`merchantEmployees`.`mEmployeeId`)"),
//         //             "mCashPercentage"
//         //         ],
//         //         [
//         //             sequelize.literal("(select mCheckPercentage from mEmployeeCommission where merchantId='"+req.deviceDetails.merchantId+"' and mEmployeeId=`merchantEmployees`.`mEmployeeId`)"),
//         //             "mCheckPercentage"
//         //         ],
//         //         [
//         //             sequelize.literal("(select mTipsCashPercentage from mEmployeeCommission where merchantId='"+req.deviceDetails.merchantId+"' and mEmployeeId=`merchantEmployees`.`mEmployeeId`)"),
//         //             "mTipsCashPercentage"
//         //         ],
//         //         [
//         //             sequelize.literal("(select mTipsCheckPercentage from mEmployeeCommission where merchantId='"+req.deviceDetails.merchantId+"' and mEmployeeId=`merchantEmployees`.`mEmployeeId`)"),
//         //             "mTipsCheckPercentage"
//         //         ]
//         //         ]
//         //     }
//         // }

//         // if(req.input.type !== 'Owner'){ 
//         //     options = { 
//         //         attributes:{
//         //             include:[ 
//         //             [
//         //                 sequelize.literal("(select sum(servicePerUnitCost*serviceQty) from ticketservices where ticketServiceId in (select ticketServiceId from ticketservices where ticketId in (select ticketId from ticketpayment where ticketId in (select ticketId from tickets where paymentStatus='Paid' ) and Date(createdDate) between Date('"+req.input.from_date.replace("T"," ").replace("Z","")+"') and  Date('"+req.input.to_date.replace("T"," ").replace("Z","")+"'))) and serviceTechnicianId=`merchantEmployees`.`mEmployeeId`  and status=1)"),
//         //                 'TotalServiceAmount'
//         //             ],
//         //             [
//         //                 sequelize.literal("(select sum(employeePercentage) from ticketcommission where ticketServiceId in (select ticketServiceId from ticketservices where ticketId in (select ticketId from ticketpayment where ticketId in (select ticketId from tickets where paymentStatus='Paid' ) and Date(createdDate) between Date('"+req.input.from_date.replace("T"," ").replace("Z","")+"') and  Date('"+req.input.to_date.replace("T"," ").replace("Z","")+"'))) and technicianId=`merchantEmployees`.`mEmployeeId`  and status=1)"),
//         //                 'ServiceAmount'
//         //             ],
//         //             [
//         //                 sequelize.literal("(select sum(tipsAmount) from ticketTips where ticketServiceId in (select ticketServiceId from ticketservices where ticketId in (select ticketId from ticketpayment where ticketId in (select ticketId from tickets where paymentStatus='Paid' ) and Date(createdDate) between Date('"+req.input.from_date.replace("T"," ").replace("Z","")+"') and  Date('"+req.input.to_date.replace("T"," ").replace("Z","")+"'))) and technicianId=`merchantEmployees`.`mEmployeeId`  and status=1)"),
//         //                 'Tips'
//         //             ],
//         //             [
//         //                 sequelize.literal("(select sum(employeePercentage) from ticketservicediscountcommission where ticketServiceId in (select ticketServiceId from ticketservices where ticketId in (select ticketId from ticketpayment where ticketId in (select ticketId from tickets where paymentStatus='Paid' ) and Date(createdDate) between Date('"+req.input.from_date.replace("T"," ").replace("Z","")+"') and  Date('"+req.input.to_date.replace("T"," ").replace("Z","")+"'))) and technicianId=`merchantEmployees`.`mEmployeeId`  and status=1)"),
//         //                 'Discount'
//         //             ],[
//         //                 sequelize.literal("(select id from mEmployeeCommission where merchantId='"+req.deviceDetails.merchantId+"' and mEmployeeId=`merchantEmployees`.`mEmployeeId`)"),
//         //                 "mCommissionId"
//         //             ], 
//         //             [
//         //                 sequelize.literal("(select mOwnerPercentage from mEmployeeCommission where merchantId='"+req.deviceDetails.merchantId+"' and mEmployeeId=`merchantEmployees`.`mEmployeeId`)"),
//         //                 "mOwnerPercentage"
//         //             ], 
//         //             [
//         //                 sequelize.literal("(select mEmployeePercentage from mEmployeeCommission where merchantId='"+req.deviceDetails.merchantId+"' and mEmployeeId=`merchantEmployees`.`mEmployeeId`)"),
//         //                 "mEmployeePercentage"
//         //             ],
//         //             [
//         //                 sequelize.literal("(select mCashPercentage from mEmployeeCommission where merchantId='"+req.deviceDetails.merchantId+"' and mEmployeeId=`merchantEmployees`.`mEmployeeId`)"),
//         //                 "mCashPercentage"
//         //             ],
//         //             [
//         //                 sequelize.literal("(select mCheckPercentage from mEmployeeCommission where merchantId='"+req.deviceDetails.merchantId+"' and mEmployeeId=`merchantEmployees`.`mEmployeeId`)"),
//         //                 "mCheckPercentage"
//         //             ],
//         //             [
//         //                 sequelize.literal("(select mTipsCashPercentage from mEmployeeCommission where merchantId='"+req.deviceDetails.merchantId+"' and mEmployeeId=`merchantEmployees`.`mEmployeeId`)"),
//         //                 "mTipsCashPercentage"
//         //             ],
//         //             [
//         //                 sequelize.literal("(select mTipsCheckPercentage from mEmployeeCommission where merchantId='"+req.deviceDetails.merchantId+"' and mEmployeeId=`merchantEmployees`.`mEmployeeId`)"),
//         //                 "mTipsCheckPercentage"
//         //             ]
//         //             ]
//         //         }
//         //     }
//         // }


//         // // var servicetaxes = await this.readAll({where:{
//         // //     ticketServiceId:{
//         // //         [Sequelize.Op.in]:sequelize.literal("( select ticketServiceId from ticketservices where ticketId in (select ticketId from ticketpayment where ticketId in (select ticketId from tickets where paymentStatus='Paid' ) and Date(createdDate) between Date('"+req.input.from_date.replace("T"," ").replace("Z","")+"') and  Date('"+req.input.to_date.replace("T"," ").replace("Z","")+"')))")
//         // //     }
//         // // },
//         // // attributes: [
//         // //         [
//         // //             sequelize.literal
//         // //         ]
//         // //     ]}, 'ticketservicetax')

//         // this.readAll(options, 'merchantEmployees').then(resp=>{
//         //     this.sendResponse({data: resp}, res, 200)
//         // })
//     }

    getReport = async(req,res)=>{
        console.log(req.input);
        var dateformat = '%d-%m-%Y';
        if(req.input.reportPeriod === 'monthly'){
            dateformat = '%m-%Y';
        }
        if(req.input.reportPeriod === 'annually'){
            dateformat = '%Y';
        }
        const owner = await this.readOne({
                where:{mEmployeeRoleName:'Owner'}, 
                attributes:{
                    include:[
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
                        ],
                        [
                            sequelize.literal("(select sum(mTaxAmount) from ticketservicetax where ticketServiceId in (select ticketserviceId from ticketservices where status=1 and ticketId in (select ticketId from tickets where isDraft=0 and paymentStatus='Paid' and Date(createdDate) between Date('"+req.input.from_date.substr(0,10)+"')  and  Date('"+req.input.to_date.substr(0,10)+"'))))"),
                            "TotalTax"
                        ],
                        [
                            sequelize.literal("(select sum(servicePerUnitCost*serviceQty) from  ticketservices where status=1 and serviceId in (select mProductId from mProducts where mProductType='Product') and ticketId in (select ticketId from tickets where isDraft=0 and paymentStatus='Paid' and Date(createdDate) between Date('"+req.input.from_date.substr(0,10)+"')  and  Date('"+req.input.to_date.substr(0,10)+"')))"),
                            "Supplies"
                        ]
                ]}}, 'merchantEmployees');
        const dateqry = "Date(createdDate) between Date('"+req.input.from_date.substr(0,10)+"')  and  Date('"+req.input.to_date.substr(0,10)+"')";
        const reportoptions = { 
            where:{ 
                ticketId:{
                    [Sequelize.Op.in]: sequelize.literal("(select ticketId from tickets where "+dateqry+" and isDraft=0 and paymentStatus='Paid')")
                }
            },
            attributes:[
                [Sequelize.col('paymentStatus'), 'paymentStatus'],
                [Sequelize.fn('strftime', dateformat, Sequelize.col('`tickets`.`createdDate`')), 'created'],
                [
                    sequelize.literal("(select count(ticketServiceId) from ticketservices where ticketId=`tickets`.`ticketId`  and status=1)"),
                    'ServiceCount'
                ],
                [
                    sequelize.literal("(select sum(servicePerUnitCost*serviceQty) from ticketservices where ticketId=`tickets`.`ticketId`  and status=1)"),
                    'TotalServiceAmount'
                ],
                [
                    sequelize.literal("(select sum(ownerPercentage) from ticketcommission where status=1 and ticketServiceId in (select ticketServiceId from ticketservices where status=1 and ticketId= `tickets`.`ticketId` )  and status=1)"),
                    'ServiceAmount'
                ],
                [
                    sequelize.literal("(select sum(tipsAmount) from ticketTips where   status=1 and ticketServiceId in (select ticketServiceId from ticketservices where status=1 and ticketId= `tickets`.`ticketId` ) and   status=1)"),
                    'Tips'
                ],
                [
                    sequelize.literal("(select sum(employeePercentage) from ticketservicediscountcommission where  status=1 and  ticketServiceId in (select ticketServiceId from ticketservices where status=1 and ticketId= `tickets`.`ticketId` )  and status=1)"),
                    'Discount'
                ],
                [
                    sequelize.literal("(select sum(ownerPercentage) from ticketservicediscountcommission where  status=1 and  ticketServiceId in (select ticketServiceId from ticketservices where status=1 and ticketId= `tickets`.`ticketId` )  and status=1)"),
                    'OwnerDiscount'
                ],
            ] ,
            // group: [
            //     [sequelize.literal(' `created`'), 'ASC']
            // ], 
        } 
        const reports = await this.readAll(reportoptions, 'tickets')

        const paymentOptions = {
            group:[
                ['payMode'],
                ['paymentType']
            ],
            where:{
                ticketId:{
                    [Sequelize.Op.in]: sequelize.literal("(select ticketId from tickets where "+dateqry+" and isDraft=0 and paymentStatus='Paid')")
                }
            },
            attributes:[
                [Sequelize.col("`transactionId`"), 'transactionId'],
                [Sequelize.col("`payMode`"), 'payMode'],
                [Sequelize.col("`paymentType`"), 'paymentType'],
                [Sequelize.fn('sum', Sequelize.col('ticketPayment')), 'paymentAmount'],
                // [
                //     sequelize.literal("(select sum(ticketPayment) from ticketpayment where transactionId=`ticketpayment`.`transactionId` and `payMode`=`ticketpayment`.`payMode` and `cardType`=`ticketpayment`.`cardType`)"),
                //     "paymentAmount"
                // ]
            ]
        }

        const payments = await this.readAll(paymentOptions, 'ticketpayment')

        const discountoptions = {
            group:[
                `mDiscountDivisionType`
            ],
            where:{
                status:1,
                ticketId:{
                    [Sequelize.Op.in]: sequelize.literal("(select ticketId from tickets where "+dateqry+" and isDraft=0 and paymentStatus='Paid')")
                }
            },
            attributes:[
                [Sequelize.fn('sum', Sequelize.col('mDiscountAmount')), 'discountAmount'],
                [Sequelize.col("`mDiscountDivisionType`"), 'mDiscountDivisionType'],
                
            ]
        }
        const discounts=await this.readAll(discountoptions, 'ticketdiscount')
        this.sendResponse({data: reports, owner:owner, payments: payments, discounts: discounts}, res, 200)
    }

    getEmpReport = async(req, res)=>{
        const emps = await this.readAll({ 
            attributes:{
                include:[
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
                    ],
                    [
                        sequelize.literal("(select sum(mTaxAmount) from ticketservicetax where ticketServiceId in (select ticketserviceId from ticketservices where status=1  and serviceTechnicianId=`merchantEmployees`.`mEmployeeId` and ticketId in (select ticketId from tickets where isDraft=0 and paymentStatus='Paid' and Date(createdDate) between Date('"+req.input.from_date.substr(0,10)+"')  and  Date('"+req.input.to_date.substr(0,10)+"'))))"),
                        "TotalTax"
                    ],
                    [
                        sequelize.literal("(select sum(servicePerUnitCost*serviceQty) from  ticketservices where status=1 and serviceTechnicianId=`merchantEmployees`.`mEmployeeId` and serviceId in (select mProductId from mProducts where mProductType='Product') and ticketId in (select ticketId from tickets where isDraft=0 and paymentStatus='Paid' and Date(createdDate) between Date('"+req.input.from_date.substr(0,10)+"')  and  Date('"+req.input.to_date.substr(0,10)+"')))"),
                        "Supplies"
                    ], 
            ]}}, 'merchantEmployees'); 
            var empslist = emps;
            this.getEmpTickets(req, res, empslist, 0, [])
    }

    getEmpTickets = async(req,res, emps, i, response)=>{ 
        var dateformat = '%d-%m-%Y';
        if(req.input.reportPeriod === 'monthly'){
            dateformat = '%m-%Y';
        }
        if(req.input.reportPeriod === 'annually'){
            dateformat = '%Y';
        }

        if(i < emps.length){
            const dateqry = "Date(createdDate) between Date('"+req.input.from_date.substr(0,10)+"')  and  Date('"+req.input.to_date.substr(0,10)+"')";
            
            var empid= emps[i].dataValues.mEmployeeId || emps[i].mEmployeeId;
            console.log("$$$$$", emps[i])
            const reportoptions = { 
                // group: [
                //     [sequelize.literal(' `created`'), 'ASC']
                // ],
                where:{
                    ticketId:{
                        [Sequelize.Op.in]: sequelize.literal("(select ticketId from tickets where "+dateqry+" and isDraft=0 and paymentStatus='Paid' and ticketId in (select ticketId from ticketservices where serviceTechnicianId='"+empid+"' and status=1))")
                    }
                }, 
                attributes:[
                    [Sequelize.col('paymentStatus'), 'paymentStatus'],
                    [Sequelize.fn('strftime', dateformat, Sequelize.col('`tickets`.`createdDate`')), 'created'],
                    [
                        sequelize.literal("(select count(ticketServiceId) from ticketservices where ticketId=`tickets`.`ticketId` and serviceTechnicianId='"+empid+"'  and status=1)"),
                        'ServiceCount'
                    ],
                    [
                        sequelize.literal("(select serviceTechnicianId from ticketservices where ticketId=`tickets`.`ticketId` and serviceTechnicianId='"+empid+"'  and status=1)"),
                        'serviceTechnicianId'
                    ],
                    [
                        sequelize.literal("(select sum(servicePerUnitCost*serviceQty) from ticketservices where ticketId=`tickets`.`ticketId` and serviceTechnicianId='"+empid+"'  and status=1)"),
                        'TotalServiceAmount'
                    ],
                    [
                        sequelize.literal("(select sum(employeePercentage) from ticketcommission where status=1 and ticketServiceId in (select ticketServiceId from ticketservices where status=1 and ticketId= `tickets`.`ticketId` ) and technicianId='"+empid+"'  and status=1)"),
                        'ServiceAmount'
                    ],
                    [
                        sequelize.literal("(select sum(tipsAmount) from ticketTips where   status=1 and ticketServiceId in (select ticketServiceId from ticketservices where status=1 and ticketId= `tickets`.`ticketId` ) and technicianId='"+empid+"'  and status=1)"),
                        'Tips'
                    ],
                    [
                        sequelize.literal("(select sum(employeePercentage) from ticketservicediscountcommission where  status=1 and  ticketServiceId in (select ticketServiceId from ticketservices where status=1 and ticketId= `tickets`.`ticketId` )  and technicianId='"+empid+"'  and status=1)"),
                        'Discount'
                    ]
                ] 
            }

            const reports = await this.readAll(reportoptions, 'tickets') 
            // console.log("**********")
            // console.log(reports);
            const discountoptions = {
                group:[
                    `mDiscountDivisionType`
                ],
                where:{
                    status:1,
                    ticketServiceId:{
                        [Sequelize.Op.in]: sequelize.literal("(select ticketServiceId from ticketservices where status=1 and serviceTechnicianId='"+empid+"' and  ticketId in (select ticketId from tickets where "+dateqry+" and isDraft=0 and paymentStatus='Paid'))")
                    }
                },
                attributes:[
                    [Sequelize.fn('sum', Sequelize.col('mDiscountAmount')), 'discountAmount'],
                    [Sequelize.col("`mDiscountDivisionType`"), 'mDiscountDivisionType'],
                    [Sequelize.col("`mEmployeeDivision`"), 'mEmployeeDivision'],
                    
                ]
            }
            const discounts=await this.readAll(discountoptions, 'ticketservicediscount')
            var obj ={
                report: reports,
                discounts: discounts,
                emp:emps[i]
            }
            response.push(obj); 
            this.getEmpTickets(req, res,emps, i+1, response)
        }
        else{
            this.sendResponse({data: response }, res, 200)
        }
    } 
}