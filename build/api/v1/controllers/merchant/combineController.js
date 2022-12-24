/* eslint-disable no-redeclare */
/* eslint-disable no-useless-constructor */
const baseController = require('../common/baseController');
const MsgController = require('../common/msgController'); 
const express = require('express'); 
const Sequelize = require('sequelize')
const sequelize =  require('../../models').sequelize 
module.exports = class TicketController extends baseController{
    path = "/merchant/combine";
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
                    path:this.path+"/ticket",
                    type:"post",
                    method: "combineTicket",
                    authorization:'accessAuth'
                }, 
            ] 
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    }  
 
    combineTicket= async(req, res, next)=>{ 
        var input = {
            combinedFrom:req.input.combinedTicketId,
            ticketId:req.input.ticketDetail.ticketId,
        } 
        this.update(`tickets`, {ticketStatus:'Voided', ticketType:'Combined'},  {where:{ticketId: input.combinedFrom} }).then(r=>{
            this.update('ticketservices', input, {where:{ticketId:  input.combinedFrom} }).then(R=>{
                this.sendResponse({message:"Service transferred successfully."}, res, 200) 
            }).catch(e=>{
                this.sendResponse({message:"Error occurred. Please close the ticket and try again"}, res, 400);
            })
        });
    }
   
}
