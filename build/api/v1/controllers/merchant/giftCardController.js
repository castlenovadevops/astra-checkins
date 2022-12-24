const baseController = require('../common/baseController');
const MsgController = require('../common/msgController');
const CommonController  = require('../common/commonController');

const express = require('express');
const authenticate = require('../../middleware/index');  
const Sequelize   = require('sequelize'); 

const sequelize =  require('../../models').sequelize

module.exports = class GiftCardController extends baseController{
    path = "/merchant/giftcard";
    router = express.Router();
    routes = [];
    msgController = new MsgController();
    commonController = new CommonController();
    constructor(props){
        super(props);
    }

    initialize(){ 
        return new Promise((resolve) => {

            this.routes = [    
                {
                    path:this.path+"/save",
                    type:"post",
                    method: "saveCard",
                    authorization:'accessAuth'
                },   
                {
                    path:this.path+"/disable",
                    type:"post",
                    method: "updateCard",
                    authorization:'accessAuth'
                },    
                {
                    path:this.path+"/getCards",
                    type:"post",
                    method: "getCards",
                    authorization:'accessAuth'
                },       
                {
                    path:this.path+"/checkandpay",
                    type:"post",
                    method: "checkAndPay",
                    authorization:'accessAuth'
                },       
                {
                    path:this.path+"/checkBalance",
                    type:"post",
                    method: "checkBalance",
                    authorization:'accessAuth'
                },  
            ]     

            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    } 


    getCards = async(req,res, next)=>{
        const giftcards = await this.readAll({where:{status:'Active', merchantId: req.deviceDetails.merchantId}}, 'giftCards')
       
        this.sendResponse({data: giftcards}, res, 200);
    }

    saveCard = async(req, res, next)=>{
        var input= req.input;
        input["createdBy"] = req.userData.mEmployeeId;
        input["createdDate"] = this.getDate();
        input["updatedBy"] = req.userData.mEmployeeId;
        input["updatedDate"] = this.getDate();
        input["status"] ='Active';
        console.log(input)
        input["validFrom"] = input.validFrom.replace("T"," ").replace("Z","");
        input["validTo"] = input.validTo.replace("T"," ").replace("Z","");
        input["merchantId"] =  req.deviceDetails.merchantId;
        delete input["id"]; 
        if(input.cardType === 'Digital'){
            var cardnumber = this.generaterandomNumber(16);
            var existrecords = await this.readAll({where:{cardNumber: cardnumber.trim(), merchantId:input.merchantId}},'giftCards');
            if(existrecords.length> 0){
                this.saveCard(req,res,next);
            }
            else{
                input["cardNumber"]=cardnumber.trim();
                input["cardBalance"]=input.cardValue;
                this.create('giftCards', input).then(card=>{
                    if(input.cardSold === 1){
                        this.saveGiftCardTicket(req, res, next, card.dataValues)
                    }
                    else{
                        this.sendResponse({message:"Gift card has been saved successfully."}, res, 200)
                    }
                }) 
            }
        }
        else{ 
            let existrecords = await this.readAll({where:{cardNumber: input.cardNumber, merchantId:input.merchantId}},'giftCards');
            if(existrecords.length === 0){
                input["cardBalance"]=input.cardValue;
                this.create('giftCards', input).then(card=>{
                    if(input.cardSold === 1){
                        this.saveGiftCardTicket(req, res, next, card.dataValues)
                    }
                    else{
                        this.sendResponse({message:"Gift card has been saved successfully."}, res, 200)
                    }
                }) 
            }
            else{
                this.sendResponse({message: "This card number already exists.", field:'cardNumber'}, res, 400)
            }
        }
    }
  
    updateCard = async(req, res, next)=>{
        var input= req.input; 
        input["updatedDate"] = this.getDate(); 
        this.update('giftCards', input, {where:{id:input.id}}).then(r=>{
            this.sendResponse({message:"Gift card has been saved successfully."}, res, 200)
        }) 
    }

    saveGiftCardTicket = async(req, res, next, card)=>{
        var ticketinput = {  
            "ownerTechnician" : '',
            "customerId" : '',
            "taxApplied": 0,
            "serviceDiscountApplied": 0,
            "ticketDiscountApplied"	: 0,
            "tipsAmount": 0,
            "taxAmount"	: 0,
            "serviceAmount"	: card.cardValue,
            "ticketTotalAmount"	:  card.cardValue,
            "ticketNotes": '', 
            "tipsType": '',
            "paymentStatus":"Pending", 
            "merchantId": req.deviceDetails.merchantId, 
            "isDraft":0,
            "ticketType":"GiftCard",
            "POSId": req.deviceDetails.device.POSId,
            "createdBy": req.userData.mEmployeeId,
            "createdDate": this.getDate(),
            "ticketCode":card.cardNumber
        }

        this.create('tickets', ticketinput).then(ticket=>{
            console.log(ticket)
            this.sendResponse({data: ticket.dataValues}, res, 200)
        }).catch(e=>{
            this.sendResponse({message:"Error occurred. Please close the ticket and try again"}, res, 400);
        })
    }


    checkAndPay = async(req, res, next)=>{
        var input = req.input;
        var date = this.getDate();
        var cardnumber = input.cardNumber;
        this.readAll({where:{
            cardNumber: cardnumber,
            status:'Active'
        }}, 'giftCards').then(allcards=>{
            if(allcards.length > 0){
                this.readAll({where:{
                    cardNumber: cardnumber,
                    status:'Active',
                    id:{
                        [Sequelize.Op.in]: sequelize.literal("(select id from giftCards where strftime('%Y-%m-%d', '"+date+"') BETWEEN  strftime('%Y-%m-%d', validFrom) and strftime('%Y-%m-%d', validTo))")
                    }
                }}, 'giftCards').then(cards=>{
                    if(cards.length > 0){ 
                        var carddetail = cards[0].dataValues || cards[0];
                        console.log("GIFTCARD PAYMENT::::", carddetail.cardBalance, input.amountToPay)
                        if(Number(carddetail.cardBalance) >= Number(input.amountToPay)){
                            var ticket = input.ticketDetail;
                            let options = {
                                where:{
                                    ticketId: ticket.ticketId
                                }
                            }
                        let payinput = {
                            "ticketId": input.ticketDetail.ticketId,
                            "transactionId":Date.now().toString().split('.')[0]	,
                            "customerPaid": '',
                            "returnedAmount":  '',
                            "ticketPayment": input.amountToPay,
                            "payMode":'GiftCard',
                            "cardType":carddetail.cardNumber,
                            "paymentType":'GiftCard',
                            "paymentNotes":'',
                            "createdBy":req.userData.mEmployeeId,
                            "createdDate":this.getDate()
                        }
                        this.create('ticketpayment', payinput).then(r=>{
                                var cardinput = {
                                    cardBalance : Number(carddetail.cardBalance) - Number(input.amountToPay),
                                    updatedDate: this.getDate(),
                                    id: carddetail.id
                                }
                                this.update('giftCards', cardinput, {where:{id: carddetail.id}}).then(re=>{
                                    this.readOne({where:options.where, attributes:[
                                    [
                                        sequelize.literal("(select sum(ticketPayment) from ticketpayment where ticketId='"+ticket.ticketId+"')"),
                                        "Paidamount"
                                    ]
                                    ]},'ticketpayment').then(paidrec=>{  
                                        var paidamount = paidrec === null ? 0 : (paidrec.Paidamount || paidrec.dataValues.Paidamount)
                                        if(paidamount === undefined || paidamount === null){
                                            paidamount = 0
                                        }
                                        console.log("remainAmount", ticket.ticketTotalAmount, paidamount)
                                        var remainAmount = Number(ticket.ticketTotalAmount) - Number(paidamount)
                                        console.log("remainAmount", remainAmount, paidamount)
                                        if(remainAmount <= 0){
                                            this.update('tickets', {paymentStatus:'Paid'}, {where:{ticketId: ticket.ticketId}}).then(r=>{
                                                this.sendResponse({message:"Paid successfully"}, res, 200);
                                            })
                                        }
                                        else{ 
                                            this.sendResponse({message:"Paid successfully"}, res, 200);
                                        }
                                    });
                                })
                                
                        })
                        }
                        else{
                            this.sendResponse({message:"Insufficient balance."}, res, 400)
                        }
                    }
                    else{
                        this.sendResponse({message:"Gift card expired."}, res, 400)
                    }
                })
            }
            else{
                this.sendResponse({message:"Not a valid gift card."}, res, 400)
            }
        })

    }



    checkBalance = async(req, res, next)=>{
        var input = req.input;
        var date = this.getDate();
        var cardnumber = input.cardNumber;
        console.log(cardnumber)
        this.readAll({where:{
            cardNumber: cardnumber,
            status:'Active'
        }}, 'giftCards').then(allcards=>{
            if(allcards.length > 0){
                this.readAll({where:{
                    cardNumber: cardnumber,
                    status:'Active',
                    id:{
                        [Sequelize.Op.in]: sequelize.literal("(select id from giftCards where strftime('%Y-%m-%d', '"+date+"') BETWEEN  strftime('%Y-%m-%d', validFrom) and strftime('%Y-%m-%d', validTo))")
                    }
                }}, 'giftCards').then(cards=>{
                    if(cards.length > 0){ 
                        var carddetail = cards[0].dataValues || cards[0]; 
                        this.sendResponse({data:carddetail}, res, 200)
                    }
                    else{
                        this.sendResponse({message:"Gift card expired."}, res, 400)
                    }
                })
            }
            else{
                this.sendResponse({message:"Not a valid gift card."}, res, 400)
            }
        })

    }
}