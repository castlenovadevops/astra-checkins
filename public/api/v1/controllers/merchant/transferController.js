/* eslint-disable no-redeclare */
/* eslint-disable no-useless-constructor */
const baseController = require('../common/baseController');
const MsgController = require('../common/msgController'); 
const express = require('express'); 
const { Sequelize } = require('sequelize');
const { service } = require('restler');

module.exports = class TicketController extends baseController{
    path = "/merchant/transfer";
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
                    path:this.path+"/createTicket",
                    type:"post",
                    method: "getTicketcode",
                    authorization:'accessAuth'
                },
                
                {
                    path:this.path+"/transferService",
                    type:"post",
                    method: "transferServiceToExist",
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
                            [Sequelize.Op.in] : Sequelize.literal("(select ticketId from tickets where Date(createdDate) = Date('"+new Date().toISOString()+"')  and isDraft=0)")
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
                        this.createTicketForTransfer(req, res, next, ticketcode)
                      }
                      else{
                        var count = 1;
                        var ticketcode =  String(count).padStart(4, '0') 
                        this.createTicketForTransfer(req, res, next, ticketcode)
                        // this.sendResponse({ticketid: String(count).padStart(4, '0')}, res, 200)
                      }
                })

            }
        })
    }

    createTicketForTransfer= async(req, res, next, ticketcode)=>{ 
        try{
        var input = {
            ticketCode: ticketcode,
            isDraft: 0, 
            "ownerTechnician" : req.input.ticketDetail.ownerTechnician,
            merchantId: req.deviceDetails.merchantId,
            POSId: req.deviceDetails.device.POSId,
            createdBy: req.userData.mEmployeeId,
            createdDate: this.getDate(),
            ticketType:'transferred',
            ticketStatus:'Active',
            paymentStatus:'Pending',
            taxApplied: req.input.ticketDetail.taxApplied,
            serviceDiscountApplied: req.input.ticketDetail.serviceDiscountApplied,
            ticketDiscountApplied:0,
            tipsAmount: req.input.service.totalTips || '',
            serviceAmount: req.input.service.subTotal,
            ticketTotalAmount:req.input.service.subTotal+ req.input.service.totalTax -  req.input.service.totalDiscount + req.input.service.totalTips
        } 
        this.create('tickets', input).then(ticket=>{ 
            this.transferService(ticket.dataValues, req, res, next);
            // this.sendResponse({data: ticket.dataValues}, res, 200)
        }).catch(e=>{
            this.sendResponse({message:"Error occurred. Please close the ticket and try again"}, res, 400);
        })
    }
    catch(e){
        console.log(e)
    }
    }   

    transferServiceToExist= async(req, res, next)=>{
        var input = { 
            tipsAmount: Number(req.input.ticketDetail.tipsAmount)+Number(req.input.service.totalTips),
            serviceAmount: Number(req.input.ticketDetail.serviceAmount) + Number(req.input.service.subTotal),
            ticketTotalAmount: Number(req.input.ticketDetail.ticketTotalAmount) + Number(req.input.service.subTotal) + Number(req.input.service.totalTax + Number(req.input.service.totalTips)), 
        }


        this.update('tickets', input, {where:{ticketId:req.input.ticketDetail.ticketId}}).then(ticket=>{
            // console.log(ticket)
            this.transferService(req.input.ticketDetail, req, res, next);
            // this.sendResponse({data: ticket.dataValues}, res, 200)
        }).catch(e=>{
            this.sendResponse({message:"Error occurred. Please close the ticket and try again"}, res, 400);
        })
    }

    transferService = async(newTicket, req, res, next)=>{
        try{
        var service = req.input.service
        if(service.ticketServiceId !== undefined){
            var input = {
                transferredFrom: req.input.ticketDetail.ticketId,
                ticketId: newTicket.ticketId
            }
            this.update('ticketservices', input, {where:{ticketServiceId: service.ticketServiceId} }).then(R=>{
                this.sendResponse({message:"Service transferred successfully."}, res, 200)
            })
        }
        else{  
            this.saveTicketServices(newTicket, req, res, next);  
        } 
    }
    catch(e){
        console.log(e)
    }
    }
saveTicketServices = async(newTicket, req, res, next, idx=0)=>{ 
    try{
        var service = req.input.service;
        var serviceinput = {
                "ticketId" : newTicket.ticketId,
                "serviceId"	: service.serviceDetail.mProductId,
                "serviceTechnicianId" : service.technician.mEmployeeId,
                "serviceQty": service.qty,
                "serviceOriginalPrice": service.originalPrice,
                "servicePrice": service.subTotal,
                "servicePerUnitCost": service.perunit_cost,
                "serviceNotes":service.serviceNotes,
                "splitFrom":'',
                "transferredFrom":'',
                "combinedFrom":'',
                "createdBy": req.userData.mEmployeeId,
                "createdDate": this.getDate(),
                "isSpecialRequest" : service.isSpecialRequest
        }
        // {
        //     "ticketId" : newTicket.ticketId,
        //     "serviceId"	: service.serviceDetail.mProductId,
        //     "serviceTechnicianId" : service.technician.mEmployeeId,
        //     "serviceQty": service.qty,
        //     "serviceOriginalPrice": service.originalPrice,
        //     "servicePrice": service.subTotal,
        //     "servicePerUnitCost": service.servicePerUnitCost,
        //     "serviceNotes":service.serviceNotes,
        //     "splitFrom":'',
        //     "transferredFrom":'',
        //     "combinedFrom":'',
        //     "createdBy": req.userData.mEmployeeId,
        //     "createdDate": this.getDate(),
        //     "isSpecialRequest" : service.isSpecialRequest
        // }
        if(service.ticketServiceId !== undefined){
            this.update('ticketservices', serviceinput, {where:{ticketServiceId: service.ticketServiceId}} ,true).then(r=>{
                this.update('ticketservicetax',{status:0},{where:{ticketServiceId: service.ticketServiceId}}, true).then(r=>{
                    this.update('ticketservicediscount',{status:0},{where:{ticketServiceId: service.ticketServiceId}}, true).then(r=>{
                        this.update('ticketservicediscountcommission',{status:0},{where:{ticketServiceId: service.ticketServiceId}}, true).then(r=>{
                            this.update('ticketTips',{status:0},{where:{ticketServiceId: service.ticketServiceId}}, true).then(r=>{
                                // this.saveTicketServices(req, res, next, idx+1);
                                if(service.totalTips > 0){
                                    var tipinput = {
                                        tipsCashPercentage: service.technician.mTipsCashPercentage,
                                        tipsCheckPercentage: service.technician.mTipsCheckPercentage,
                                        technicianId:service.technician.mEmployeeId,
                                        tipsAmount: service.totalTips,
                                        ticketServiceId: service.ticketServiceId,
                                        createdBy: req.userData.mEmployeeId,
                                        createdDate: this.getDate(),
                                        status:1
                                    }
                                    this.create('ticketTips', tipinput).then(rr=>{
                                        this.saveTicketServiceTax(req,res,next,service.ticketServiceId,idx,0)
                                    })
                                }
                                else{
                                    this.saveTicketServiceTax(req,res,next,service.ticketServiceId,idx,0)
                                }
                            })
                        })
                    });
                })
            })
        }
        else{
            this.create('ticketservices', serviceinput, true).then(r=>{ 
                var ticketServiceId = r.dataValues.ticketServiceId || r.ticketServiceId
                if(service.totalTips > 0){
                    var tipinput = {
                        tipsCashPercentage: service.technician.mTipsCashPercentage,
                        tipsCheckPercentage: service.technician.mTipsCheckPercentage,
                        technicianId:service.technician.mEmployeeId,
                        tipsAmount: service.totalTips,
                        ticketServiceId:ticketServiceId,
                        createdBy: req.userData.mEmployeeId,
                        createdDate: this.getDate(),
                        status:1
                    }
                    this.create('ticketTips', tipinput).then(rr=>{
                        this.saveTicketServiceTax(req,res,next,ticketServiceId,idx,0)
                    })
                }
                else{
                    this.saveTicketServiceTax(req,res,next,ticketServiceId,idx,0)
                } 
            })
        }  
    }
        catch(e){
            console.log(e)
        }
}

saveTicketServiceTax= async (req,res,next,ticketServiceId,idx,tid)=>{
    var service = req.input.service 
    if(tid < service.ticketservicetaxes.length){
        var input = service.ticketservicetaxes[tid];
        var taxinput = {
            ticketServiceId: ticketServiceId,
            mTaxId: input.mTaxId,
            mTaxName: input.mTaxName,
            mTaxType: input.mTaxType,
            mTaxValue: input.mTaxValue,
            mTaxAmount: input.mTaxAmount,
            status:1,
            createdBy: req.userData.mEmployeeId,
            createdDate: this.getDate(),
        } 
        this.create('ticketservicetax', taxinput, true).then(r=>{ 
            this.saveTicketServiceTax(req, res, next, ticketServiceId, idx, tid+1)
        }).catch(e=>{
            console.log("ERROR", e)
        })
    }
    else{ 
        this.saveTicketServiceDiscount(req,res,next,ticketServiceId,idx, 0)
    }
}

saveTicketServiceDiscount= async (req,res,next,ticketServiceId,idx,tid)=>{
    var service = req.input.service 
    console.log("DISCOUNT SAVE CALLED")
    if(tid < service.ticketservicediscounts.length){
        var input = service.ticketservicediscounts[tid];
        var disinput = {
            ticketServiceId: ticketServiceId,
            mDiscountId: input.mDiscountId,
            mDiscountName: input.mDiscountName,
            mDiscountType: input.mDiscountType,
            mDiscountValue: input.mDiscountValue,
            mDiscountAmount: input.mDiscountAmount,
            mDiscountDivisionType: input.mDiscountDivisionType,
            mOwnerDivision: input.mOwnerDivision||'',
            mEmployeeDivision: input.mEmployeeDivision||'',
            status:1,
            createdBy: req.userData.mEmployeeId,
            createdDate: this.getDate(),
        }
        console.log("DISCOUNT SAVE CALLED", disinput)
        this.create('ticketservicediscount', disinput, true).then(r=>{
            var ownerPercentage = 0;
            var empPercentage = 0;
            if(input.mDiscountDivisionType === 'Owner'){
                ownerPercentage = input.mDiscountAmount
                empPercentage = 0;
            }
            else if (input.mDiscountDivisionType === 'Employee'){
                ownerPercentage = 0
                empPercentage = input.mDiscountAmount;
            }
            else{ 
                ownerPercentage = Number(input.mDiscountAmount) * (Number(input.mOwnerDivision)/100)
                empPercentage = Number(input.mDiscountAmount) * (Number(input.mEmployeeDivision)/100)
            }
            var servicediscountcommission_input={
                technicianId: service.technician.mEmployeeId,
                commissionId: input.mDiscountId,
                ownerPercentage: ownerPercentage,
                employeePercentage: empPercentage,
                totalDiscountAmount: input.mDiscountAmount, 
            }
            this.create(`ticketservicediscountcommission`, servicediscountcommission_input).then(r=>{ 
                this.saveTicketServiceDiscount(req, res, next, ticketServiceId, idx, tid+1)
            })
        })
    }
    else{
        console.log("DISCOUNT SAVE ENDED")
        this.saveTicketServiceCommission(req,res,next,idx)
    }
}

saveTicketServiceCommission = async (req,res,next,idx)=>{
    try{
    var service = req.input.service;
    var servicecommission_input={
        technicianId: service.technician.mEmployeeId,
        commissionId: service.technician.mCommissionId,
        ownerPercentage: (Number(service.technician.mOwnerPercentage) / 100) * Number(service.subTotal),
        employeePercentage: (Number(service.technician.mEmployeePercentage) / 100) * Number(service.subTotal),
        totalServiceCost: service.subTotal,
        cashPercentage: service.technician.mCashPercentage,
        checkPercentage: service.technician.mCheckPercentage,
    }
    this.create('ticketcommission', servicecommission_input).then(r=>{
        this.sendResponse({message:"Service transferred successfully."}, res, 200)
    })
}catch(e){
    console.log(e)
}
}

}
