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
                    path:this.path+"/getTransactions",
                    type:"post",
                    method: "getTransactions",
                    authorization:'accessAuth'
                }, 
                
            ] 
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    }  

    getTransactions = async(req, res)=>{
        var input = req.input

        var options = {
            where:{
                id:{
                    [Sequelize.Op.in] : Sequelize.literal("(select id from ticketpayment where Date(createdDate) between Date('"+input.from_date+"') and Date('"+input.to_date+"') )")
                }
            },
            include:[
                {
                    model:this.models.tickets,
                    required: false
                }
            ],
            attributes:{
                include:[
                    [
                        Sequelize.col( '`ticket`.`createdDate`'),
                        'ticketDate'
                    ],
                    [
                        Sequelize.literal("(select mEmployeeFirstName from merchantEmployees where mEmployeeId=`ticketpayment`.`createdBy`)"),
                        'mEmployeeFirstName'
                    ],
                    [
                        Sequelize.literal("(select mEmployeeLastName from merchantEmployees where mEmployeeId=`ticketpayment`.`createdBy`)"),
                        'mEmployeeLastName'
                    ]
                ]
            }
        }

        if(input.from_date.substr(0,10) === input.to_date.substr(0,10)){
            options.where={
                id:{
                    [Sequelize.Op.in] : Sequelize.literal("(select id from ticketpayment where Date(createdDate) = Date('"+input.from_date+"'))")
                }
            }
        }

        this.readAll(options, 'ticketpayment').then(results=>{
            this.sendResponse({data: results}, res, 200)
        })

    }

}
