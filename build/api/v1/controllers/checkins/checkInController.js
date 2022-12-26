/* eslint-disable no-useless-constructor */
const baseController = require('../common/baseController');
const MsgController = require('../common/msgController'); 
const express = require('express'); 
const APIManager = require('../../utils/apiManager'); 
const  Sequelize  = require('sequelize');
const fontList = require('font-list');
const { sequelize } = require('../../models');
const moment = require('moment'); 

const find = require('local-devices');
module.exports = class CheckInController extends baseController{
    path = "/pos/checkins";
    routes = [];
    apiManager = new APIManager();
    msgController = new MsgController();
    constructor(props){
        super(props);
    }

    initialize(){ 
        return new Promise((resolve) => {
            this.routes = [
                {
                    path:this.path+"/getDevices",
                    type:"post",
                    method: "getDevices",
                    authorization:'accessAuth'
                },
                {
                    path:this.path+"/saveCustomer",
                    type:"post",
                    method: "saveCustomer",
                    authorization:'accessAuth'
                },
                {
                    path:this.path+"/checkPOS",
                    type:"post",
                    method: "checkPOS",
                    authorization:'accessAuth'
                },
                {
                    path:this.path+"/receiveCheckin",
                    type:"post",
                    method: "receiveCheckin",
                    authorization:'accessAuth'
                }
                
            ]
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    } 

    getDevices = async(req, res, next)=>{
        var thisobj = this;
        find().then(devices => {
            console.log(devices)
            thisobj.sendResponse({data: devices}, res, 200)
          }).catch(e=>{
            thisobj.sendResponse({message:"Error"}, res, 400)
          })
    }


    checkPOS = async(req, res, next)=>{  
        console.log("CHECKIN CALLED")
        this.sendResponse({message:"Connection established"}, res, 200)
    }

    receiveCheckin = async(req, res, next)=>{
        var input = req.input;
        console.log("RECEIVED INPUT ", input)
        this.sendResponse({data: input}, res, 200)
    }
}