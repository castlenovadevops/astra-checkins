/* eslint-disable no-redeclare */
/* eslint-disable no-useless-constructor */
const baseController = require('../common/baseController');
const MsgController = require('../common/msgController'); 
const express = require('express');  

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
                    path:this.path+"/saveTicket",
                    type:"post",
                    method: "saveTicket",
                    authorization:'accessAuth'
                },  
            ] 
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    } 

    saveTicket = async(req, res, next)=>{
        var input = req.input;
        var ticketDetail = input.ticketDetail;
        console.log("OWNER TECH::: ", ticketDetail);
        var ticketinput = {  
            "ownerTechnician" : ticketDetail.ownerTechnician,
            "customerId" : input.customer_detail.mCustomerId || ticketDetail.customerId,
            "taxApplied": ticketDetail.taxApplied,
            "serviceDiscountApplied": ticketDetail.serviceDiscountApplied,
            "ticketDiscountApplied"	: ticketDetail.ticketDiscountApplied,
            "tipsAmount": ticketDetail.tipsAmount,
            "taxAmount"	: ticketDetail.taxAmount,
            "serviceAmount"	: ticketDetail.serviceAmount,
            "ticketTotalAmount"	: ticketDetail.ticketTotalAmount,
            "ticketNotes": ticketDetail.ticketNotes, 
            "tipsType": ticketDetail.tipsType,
            "paymentStatus":"Pending", 
            "merchantId": req.deviceDetails.merchantId, 
            "isDraft":0
        }


        this.update('tickets', ticketinput, {where:{ticketId: ticketDetail.ticketId}},true).then(re=>{  
            this.update('ticketservices',{status:0},{where:{ticketId: ticketDetail.ticketId}}, true).then(r=>{  
                this.update('ticketdiscount',{status:0},{where:{ticketId: ticketDetail.ticketId}}, true).then(r=>{ 
                    this.update('ticketdiscountcommission',{status:0},{where:{ticketId: ticketDetail.ticketId}}, true).then(r=>{ 
                        this.saveTicketServices(req, res, next); 
                    });
                });
            })
        })
    }

    saveTicketServices = async(req, res, next, idx=0)=>{
        if(idx<req.input.selectedServices.length){
            var service = req.input.selectedServices[idx];
            console.log("perunit_cost", service.perunit_cost)
            var serviceinput = {
                "ticketId" : req.input.ticketDetail.ticketId,
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
            console.log("SERVICE INPUT::::::",service, serviceinput)
            // if(service.ticketServiceId !== undefined){
            //     this.update('ticketservices', serviceinput, {where:{ticketServiceId: service.ticketServiceId}} ,true).then(r=>{
            //         this.update('ticketservicetax',{status:0},{where:{ticketServiceId: service.ticketServiceId}}, true).then(r=>{
            //             this.update('ticketservicediscount',{status:0},{where:{ticketServiceId: service.ticketServiceId}}, true).then(r=>{
            //                 this.update('ticketservicediscountcommission',{status:0},{where:{ticketServiceId: service.ticketServiceId}}, true).then(r=>{
            //                     this.update('ticketTips',{status:0},{where:{ticketServiceId: service.ticketServiceId}}, true).then(r=>{
            //                         // this.saveTicketServices(req, res, next, idx+1);
            //                         if(Number(service.totalTips) > 0){
            //                             var tipinput = {
            //                                 tipsCashPercentage: service.technician.mTipsCashPercentage,
            //                                 tipsCheckPercentage: service.technician.mTipsCheckPercentage,
            //                                 technicianId:service.technician.mEmployeeId,
            //                                 tipsAmount: service.totalTips,
            //                                 ticketServiceId: service.ticketServiceId,
            //                                 createdBy: req.userData.mEmployeeId,
            //                                 createdDate: this.getDate(),
            //                                 status:1
            //                             }
            //                             this.create('ticketTips', tipinput).then(rr=>{
            //                                 this.saveTicketServiceTax(req,res,next,service.ticketServiceId,idx,0)
            //                             })
            //                         }
            //                         else{
            //                             this.saveTicketServiceTax(req,res,next,service.ticketServiceId,idx,0)
            //                         }
            //                     })
            //                 })
            //             });
            //         })
            //     })
            // }
            // else{
                this.create('ticketservices', serviceinput, true).then(r=>{ 
                    console.log(r)
                    var ticketServiceId = r.dataValues.ticketServiceId || r.ticketServiceId
                    console.log(ticketServiceId)
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
            // }
        }
        else{
            this.saveTicketDiscount(req, res, next)
        }
    }

    saveTicketServiceTax= async (req,res,next,ticketServiceId,idx,tid)=>{
        var service = req.input.selectedServices[idx]; 
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
        var service = req.input.selectedServices[idx];
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
                    ticketServiceId: ticketServiceId,
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
            this.saveTicketServiceCommission(req,res,next,idx,ticketServiceId)
        }
    }

    saveTicketServiceCommission = async (req,res,next,idx,ticketServiceId)=>{
        var service = req.input.selectedServices[idx];
        var servicecommission_input={
            ticketServiceId: ticketServiceId,
            technicianId: service.technician.mEmployeeId,
            commissionId: service.technician.mCommissionId,
            ownerPercentage: (Number(service.technician.mOwnerPercentage) / 100) * Number(service.subTotal),
            employeePercentage: (Number(service.technician.mEmployeePercentage) / 100) * Number(service.subTotal),
            totalServiceCost: service.subTotal,
            cashPercentage: service.technician.mCashPercentage,
            checkPercentage: service.technician.mCheckPercentage,
        }
        this.create('ticketcommission', servicecommission_input).then(r=>{
            this.saveTicketServices(req, res, next, idx+1); 
        })
    }


    saveTicketDiscount = async(req, res, next) =>{
        this.saveTicketDiscountValues(0, req, res, next);
    }

    saveTicketDiscountValues = async(i, req, res)=>{ 
        var ticketdiscounts = Object.assign([], req.input.ticketdiscounts);
        if(i< ticketdiscounts.length){
            var input = ticketdiscounts[i]
            var disinput = {
                ticketId: req.input.ticketDetail.ticketId,
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
            this.create('ticketdiscount', disinput).then(r=>{
                this.saveTicketDiscountValues(i+1, req, res)
            })
        }
        else{
            this.saveTicketDiscountCommission(0, req, res)
        }
    }

    saveTicketDiscountCommission = async(i, req, res)=>{
        var ticketdiscountcommissions = Object.assign([], req.input.ticketdiscount_commissions);
        console.log(i,ticketdiscountcommissions.length )
        if(i< ticketdiscountcommissions.length){
            var input = ticketdiscountcommissions[i]  
            this.create('ticketdiscountcommission', input).then(r=>{
                this.saveTicketDiscountCommission(i+1, req, res)
            })
        }
        else{ 
            this.sendResponse({message: "Ticket saved successfully."}, res, 200)
        }
    }
}  
