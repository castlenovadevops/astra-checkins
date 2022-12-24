/* eslint-disable no-redeclare */
/* eslint-disable no-useless-constructor */
const baseController = require('../common/baseController');
const MsgController = require('../common/msgController'); 
const express = require('express'); 
const { Sequelize } = require('sequelize');
const sequelize =  require('../../models').sequelize

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
                    path:this.path+"/getTicketcode",
                    type:"post",
                    method: "getTicketcode",
                    authorization:'accessAuth'
                },
                {
                    path:this.path+"/void",
                    type:"post",
                    method: "voidTicket",
                    authorization:'accessAuth'
                },
                {
                    path:this.path+"/getOpenTickets",
                    type:"post",
                    method: "getOpenTickets",
                    authorization:'accessAuth'
                },
                
                {
                    path:this.path+"/getPaidTickets",
                    type:"post",
                    method: "getPaidTickets",
                    authorization:'accessAuth'
                },
                
                {
                    path:this.path+"/getClosedTicketsToBatch",
                    type:"post",
                    method: "getClosedTicketsToBatch",
                    authorization:'accessAuth'
                },
                
                {
                    path:this.path+"/getTicketDetail",
                    type:"post",
                    method: "getTicketDetail",
                    authorization:'accessAuth'
                },
                
            ] 
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    } 

    getTicketcode = async(req,res, next)=>{
        let options = {
            where:{ 
                ticketId:{
                    [Sequelize.Op.in] : Sequelize.literal("(select ticketId from tickets where Date(createdDate) > Date('"+new Date().toISOString()+"') and isDraft=0)")
                }
            }
        }

        this.readAll(options, 'tickets').then(results=>{
            if(results.length > 0){
                this.sendResponse({message:"System date mismatch. Please set correct date and time."}, res, 400)
            }
            else{
                let options = {
                    where:{
                        ticketId:{
                            [Sequelize.Op.in] : Sequelize.literal("(select ticketId from tickets where Date(createdDate) = Date('"+new Date().toISOString()+"')  and isDraft=0 and ticketType != 'GiftCard')")
                        }
                    },
                    order:[
                        ["ticketCode", "desc"]
                    ]
                }
                this.readAll(options, 'tickets').then(rows=>{
                    if(rows.length > 0){
                        // console.log(rows[0].ticketCode)
                        var ticketcode = rows[0].ticketCode !== '' && rows[0].ticketCode !== undefined &&rows[0].ticketCode!==null ? rows[0].ticketCode : 0;
                        var count = Number(ticketcode)+1; 
                        var ticketcode =  String(count).padStart(4, '0') 
                        this.createDraftTicket(req, res, next, ticketcode)
                      }
                      else{
                        var count = 1;
                        var ticketcode =  String(count).padStart(4, '0') 
                        this.createDraftTicket(req, res, next, ticketcode)
                        // this.sendResponse({ticketid: String(count).padStart(4, '0')}, res, 200)
                      }
                })

            }
        })
    }

    createDraftTicket= async(req, res, next, ticketcode)=>{
        var input = {
            ticketCode: ticketcode,
            isDraft: 1, 
            merchantId: req.deviceDetails.merchantId,
            POSId: req.deviceDetails.device.POSId,
            createdBy: req.userData.mEmployeeId,
            createdDate: this.getDate()
        }

        this.create('tickets', input).then(ticket=>{
            console.log(ticket)
            this.sendResponse({data: ticket.dataValues}, res, 200)
        }).catch(e=>{
            this.sendResponse({message:"Error occurred. Please close the ticket and try again"}, res, 400);
        })
    }

    voidTicket= async(req,res, next)=>{
        this.readOne({where:{ticketId: req.input.data}}, 'tickets').then(ticket=>{  
            console.log("TICKET:::")
            console.log(ticket)
            if(ticket.dataValues.isDraft === '1' || ticket.isDraft=== '1'){
                console.log("DELETE API CALLEd")
                this.delete('tickets',{ticketId: req.input.data}).then(resp=>{
                    this.sendResponse({message:"Voided successfully."}, res, 200);
                }).catch(e=>{
                    console.log(e)
                })
            }
            else{
                this.update('tickets', {ticketStatus:'Voided'},{where: {ticketId: req.input.data}}).then(resp=>{
                    this.sendResponse({message:"Voided successfully."}, res, 200);
                })
            }
        }).catch(e=>{
            console.log(e)
            this.sendResponse({message:"Error Occurred."}, res, 400);
        })
    }


    getOpenTickets = async(req, res, next)=>{
        console.log("GETOPEN TICKET CALLED")
        let options = {
            order:[
                [
                    'createdDate', 'desc'
                ]
            ],
            include:[
                {
                    model: this.models.mCustomers,
                    required: false,
                    attributes:{
                        include:[  
                            [
                                sequelize.literal("(select   SUM(Earned)-SUM(Redeemed) FROM ( select pointsCount as Earned, 0 as Redeemed From customerLoyaltyPoints where status='Earned' and customerId=`mCustomer`.`mCustomerId` union all select 0 as Earned, pointsCount as Redeemed From customerLoyaltyPoints where status='Redeemed' and customerId=`mCustomer`.`mCustomerId` ) )"),
                                // sequelize.literal("(select sum(pointsCount) from customerLoyaltyPoints where status='Earned' and customerId=`mCustomer`.`mCustomerId`)"),
                                "LoyaltyPoints"
                            ]
                        ]
                    }
                },
                {
                    model: this.models.merchantEmployees,
                    required: false
                }, 
                {
                    model: this.models.ticketdiscount,
                    required: false,
                    where:{
                        status:1
                    }
                }, 
            ],
            where:{
                ticketStatus:'Active',
                paymentStatus:{
                    [Sequelize.Op.in]:['Pending', 'Partially Paid']
                },
                ticketType:{
                    [Sequelize.Op.ne]:'GiftCard'
                }
            },
            attributes:{
                include:[
                    [
                        Sequelize.col('`tickets`.`ticketId`'),
                        'id'
                    ]
                ]
            }
        }

        this.readAll(options, 'tickets').then(results=>{
            this.sendResponse({data: results}, res, 200);
        })
    }

    getClosedTicketsToBatch = async(req, res)=>{
        console.log(req.input)
        var fromdate = req.input.from_date || this.getDate()
        var todate = req.input.to_date || this.getDate()

        let options = {
            include:[
                {
                    model: this.models.mCustomers,
                    required: false,
                    attributes:{
                        include:[  
                            [
                                sequelize.literal("(select SUM(Earned)-SUM(Redeemed) FROM ( select pointsCount as Earned, 0 as Redeemed From customerLoyaltyPoints where status='Earned' and customerId=`mCustomer`.`mCustomerId` union all select 0 as Earned, pointsCount as Redeemed From customerLoyaltyPoints where status='Redeemed' and customerId=`mCustomer`.`mCustomerId` ) )"),
                //  sequelize.literal("(select sum(pointsCount) from customerLoyaltyPoints where status='Earned' and customerId=`mCustomer`.`mCustomerId`)"),
                                "LoyaltyPoints"
                            ]
                        ]
                    }
                },
                {
                    model: this.models.merchantEmployees,
                    required: false
                }, 
                {
                    model: this.models.ticketdiscount,
                    required: false,
                    where:{
                        status:1
                    }
                }, 
                {
                    model: this.models.ticketpayment,
                    required: false, 
                }, 
            ],
            where:{
                ticketStatus:'Active',
                paymentStatus:'Paid',
                [Sequelize.Op.or]:[
                    { 
                        batchId:{
                            [Sequelize.Op.eq]:''
                        },
                    },
                    {
                        batchId:{
                            [Sequelize.Op.eq]: null
                        },
                    }
                ],
                ticketId:{
                    [Sequelize.Op.in]: sequelize.literal("(select ticketId from ticketpayment where payMode='card')")
                }
            },
            attributes:{
                include:[
                    [
                        Sequelize.col('`tickets`.`ticketId`'),
                        'id'
                    ]
                ]
            }
        }

        this.readAll(options, 'tickets').then(results=>{
            this.sendResponse({data: results}, res, 200);
        })
    }

    getPaidTickets = async(req, res)=>{
        console.log(req.input)
        var fromdate = req.input.from_date || this.getDate()
        var todate = req.input.to_date || this.getDate()

        let options = {
            include:[
                {
                    model: this.models.mCustomers,
                    required: false,
                    attributes:{
                        include:[  
                            [
                                sequelize.literal("(select SUM(Earned)-SUM(Redeemed) FROM ( select pointsCount as Earned, 0 as Redeemed From customerLoyaltyPoints where status='Earned' and customerId=`mCustomer`.`mCustomerId` union all select 0 as Earned, pointsCount as Redeemed From customerLoyaltyPoints where status='Redeemed' and customerId=`mCustomer`.`mCustomerId` ) )"),
                //  sequelize.literal("(select sum(pointsCount) from customerLoyaltyPoints where status='Earned' and customerId=`mCustomer`.`mCustomerId`)"),
                                "LoyaltyPoints"
                            ]
                        ]
                    }
                },
                {
                    model: this.models.merchantEmployees,
                    required: false
                }, 
                {
                    model: this.models.ticketdiscount,
                    required: false,
                    where:{
                        status:1
                    }
                }, 
                {
                    model: this.models.ticketpayment,
                    required: false, 
                }, 
            ],
            where:{
                ticketStatus:'Active',
                paymentStatus:'Paid',
                ticketType:{
                    [Sequelize.Op.ne]:'GiftCard'
                },
                ticketId:{
                    [Sequelize.Op.in]: sequelize.literal("(select ticketId from ticketpayment where createdDate between '"+fromdate.substring(0, 10)+" 00:00:00' and '"+todate.substring(0, 10)+" 23:59:59')")
                }
            },
            attributes:{
                include:[
                    [
                        Sequelize.col('`tickets`.`ticketId`'),
                        'id'
                    ]
                ]
            }
        }

        this.readAll(options, 'tickets').then(results=>{
            this.sendResponse({data: results}, res, 200);
        })
    }

    getTicketDetail = async(req, res)=>{
        var input = req.input;
        let options = {
            include:[
                {
                    model: this.models.mCustomers,
                    required: false,
                    attributes:{
                        include:[  
                            [
                                sequelize.literal("(select  SUM(Earned)-SUM(Redeemed) FROM ( select pointsCount as Earned, 0 as Redeemed From customerLoyaltyPoints where status='Earned' and customerId=`mCustomer`.`mCustomerId` union all select 0 as Earned, pointsCount as Redeemed From customerLoyaltyPoints where status='Redeemed' and customerId=`mCustomer`.`mCustomerId` ) )"),
                                // sequelize.literal("(select sum(pointsCount) from customerLoyaltyPoints where status='Earned' and customerId=`mCustomer`.`mCustomerId`)"),
                                "LoyaltyPoints"
                            ]
                        ]
                    }
                },
                {
                    model: this.models.merchantEmployees,
                    required: false
                }, 
                {
                    model: this.models.ticketdiscount,
                    required: false,
                    where:{
                        status:1
                    }
                }, 
                {
                    model: this.models.ticketpayment,
                    required: false, 
                }, 
            ],
            where:{
                ticketStatus:'Active', 
                ticketId: input.ticketId
            },
            attributes:{
                include:[
                    [
                        Sequelize.col('`tickets`.`ticketId`'),
                        'id'
                    ]
                ]
            }
        }

        this.readOne(options, 'tickets').then(results=>{
            this.sendResponse({data: results}, res, 200);
        })
    }
}
