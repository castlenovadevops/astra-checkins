const baseController = require('../common/baseController');
const MsgController = require('../common/msgController');

const express = require('express');
const authenticate = require('../../middleware/index'); 
const Sequelize = require('sequelize')
const sequelize =  require('../../models').sequelize
module.exports = class RegistrationController extends baseController{
    path = "/merchant/tax";
    router = express.Router();
    routes = [];
    msgController = new MsgController();
    constructor(props){
        super(props);
    }

    initialize(){ 
        return new Promise((resolve) => {
            this.routes = [
                {
                    path:this.path+"/save",
                    type:"post",
                    method: "saveTax",
                    authorization:'accessAuth'
                },
                {
                    path:this.path+"/get",
                    type:"post",
                    method: "getTax",
                    authorization:'accessAuth'
                },
                {
                    path:this.path+"/getActive/",
                    type:"post",
                    method: "getActive",
                    authorization:'accessAuth'
                },
                {
                    path:this.path+"/getByType/",
                    type:"post",
                    method: "getByType",
                    authorization:'accessAuth'
                },
                {
                    path:this.path+"/getByType/default",
                    type:"post",
                    method: "getDefaulttax",
                    authorization:'accessAuth'
                },
                {
                    path:this.path+"/getByType/all",
                    type:"post",
                    method: "getAlltax",
                    authorization:'accessAuth'
                },
                {
                    path:this.path+"/update",
                    type:"post",
                    method: "updateTax",
                    authorization:'accessAuth'
                },
                {
                    path:this.path+"/updateTaxDefault",
                    type:"post",
                    method: "updateTaxDefault",
                    authorization:'accessAuth'
                }
            ]
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    } 



    saveTax= async(req,res,next)=>{
        var input = req.input;
        if(input.isDefault === null || input.isDefault === undefined || input.isDefault.length === 0){
            input.isDefault = '0'
            console.log( input.isDefault, input ,"ASDASD!@#!@#!@#!")
        } 
        this.readAll({where:{mTaxStatus:1, isDefault:1,  merchantId:req.deviceDetails.merchantId}}, 'mTax').then(async (response)=>{
            var taxids = response.map(r=>r.id)
            var throwErr =false;
            if(input.id !== undefined){
                if(taxids.indexOf(input.id) === -1){
                    throwErr = true;
                }
                console.log("THROWERR CALLED",taxids, input.id, throwErr)
            }
            else{
                throwErr = true;
            }

            if(throwErr && response.length>0   && input.isDefault.toString() === '1' && input.updateDefault === undefined){
                var taxes = response.map(r=>{ return "<li>"+r.mTaxName+"</li>"});
                var limsg = "<br/><ul className='errorDivs'>"+taxes.join("")+"</li>";
                this.sendResponse({status:405, message:this.mDefaultTax+limsg}, res, 405)
            }
            else{ 
                if(input.updateDefault){ 
                    console.log("UPDATEDEFAULT CALLED")
                    // await this.update('mTax', { isDefault: 0, updatedBy: req.userData.mEmployeeId, updatedDate: this.getDate()}, {where:{isDefault: 1, merchantId: req.deviceDetails.merchantId }}, 'mTaxStatus', 'id')
                }
                input.createdBy= req.userData.mEmployeeId;
                input.createdDate = this.getDate();
                input.updatedBy= req.userData.mEmployeeId;
                input.merchantId = req.deviceDetails.merchantId;
                input.updatedDate = this.getDate();
                // input.isDefault = req.input.isDefault[0]
                input.isDefault = input.isDefault !== undefined ? (input.isDefault instanceof Array ? input.isDefault[0] : input.isDefault) : '0';
                
                if(input.updateDefault == 1){ 
                    await this.update('mTax', { isDefault: 0, updatedBy: req.userData.mEmployeeId, updatedDate: this.getDate()}, {where:{isDefault: 1, merchantId: req.deviceDetails.merchantId }},'mTaxStatus', 'id')
                }
                console.log(input)
                if(input.id != undefined){
                    console.log("UPDATEDEFAULT ID CALLED")
                    this.updateWithNew('mTax', input, {where:{id:input.id}}, 'mTaxStatus', 'id').then(resp=>{
                        this.sendResponse({message:"Updated sucessfully"}, res, 200)
                    })
                }
                else{ 
                    console.log("UPDATEDEFAULT ELSE CALLED")
                    this.create('mTax', input).then(resp=>{
                        this.sendResponse({message:"Saved sucessfully"}, res, 200)
                    })
                } 
            }
        })
    }
    getByType= async (req,res,next)=>{ 
        var type = req.params.type;
        var where = {
            merchantId: req.deviceDetails.merchantId,
            mTaxStatus:{
                [Sequelize.Op.notIn]:[0,2]
            },
        }
        if(type === 'default'){
            where = {
                merchantId: req.deviceDetails.merchantId,
                mTaxStatus:{
                    [Sequelize.Op.notIn]:[0,2]
                },
                isDefault:1
            }
        }
        let tax = await this.readAll({where: where, order: [
            ['createdDate','ASC']
        ],
        // attributes:{include: [ [
        //     Sequelize.col('mTaxId'),
        //     `id`
        // ], ]}
        }, 'mTax')
        this.sendResponse({ data: tax}, res, 200);
    }

    getTax = async (req,res,next)=>{  
        let tax = await this.readAll({order: [
            ['createdDate','ASC']
        ],
        where:{  merchantId:req.deviceDetails.merchantId,
            id:{
            [Sequelize.Op.in]:sequelize.literal("(select id from mTax where mTaxStatus!=2)")
        } }
        // attributes:{include: [ [
        //     Sequelize.col('mTaxId'),
        //     `id`
        // ], ]}
        }, 'mTax')

        this.sendResponse({ data: tax}, res, 200);
    }

    updateTax = async(req, res,next)=>{ 
        const input = req.input; 
        const user = req.userData;  
        var data = {
            id: input.id,
            mTaxStatus: input.status,
            updatedBy: user.id,
            updatedDate: this.getDate()
        }
        console.log(data)
 
        this.updateWithNew('mTax', data, {where:{id:input.id}},'mTaxStatus', 'id').then(r1=>{
            this.sendResponse({message:"Tax details updated successfully."}, res, 200);
        }) 
    }

    updateTaxDefault = async(req, res,next)=>{ 
        const input = req.input; 
        const user = req.userData;  
        if(input.id !== undefined){
            var data = {
                id: input.id,
                isDefault: input.isDefault,
                updatedBy: user.id,
                updatedDate: this.getDate()
            }
            console.log(input)

            this.readAll({where:{mTaxStatus:1, isDefault:1,  merchantId:req.deviceDetails.merchantId}}, 'mTax').then(async (response)=>{
                var taxids = response.map(r=>r.id)
                var throwErr =false;
                if(input.id !== undefined){
                    if(taxids.indexOf(input.id) === -1){
                        throwErr = true;
                    }
                }
                else{
                    throwErr = true;
                }
                if(throwErr && response.length>0 &&  input.isDefault.toString() === '1' && input.updateDefault === undefined){ 
                    var taxesstr = '';
                    var endnum = response.length > 3 ? 3 : response.length
                    for(var i=0;i< endnum;i++){
                        taxesstr +="<li>"+response[i].mTaxName;
                        if(i==endnum-1 && response.length > 3){
                            taxesstr+="...+"+(response.length-endnum)+" more"
                        }
                        taxesstr+="</li>"
                    } 
                    var limsg = "<br/><ul className='errorDivs'>"+taxesstr+"</li>";
                    this.sendResponse({status:405, message:this.mDefaultTax+limsg}, res, 405)
                }
                else{  
                    if(input.updateDefault === 1){ 
                        await this.updateWithNew('mTax', { isDefault: 0, updatedBy: req.userData.mEmployeeId, updatedDate: this.getDate()}, {where:{isDefault: 1, merchantId: req.deviceDetails.merchantId }},'mTaxStatus', 'id')
                    } 
                    this.updateWithNew('mTax', data, {where:{id:input.id}},'mTaxStatus', 'id').then(r1=>{
                        this.sendResponse({message:"Tax details updated successfully."}, res, 200);
                    })
                }
            });
        }
        else{
            console.log("ELSE COND")
            console.log(input)
            this.readAll({where:{mTaxStatus:1, isDefault:1,  merchantId:req.deviceDetails.merchantId}}, 'mTax').then(async (response)=>{
                var taxids = response.map(r=>r.id)
                var throwErr =false;
                if(input.id !== undefined){
                    if(taxids.indexOf(input.id) === -1){
                        throwErr = true;
                    }
                }
                else{
                    throwErr = true;
                }
                if(throwErr && response.length>0 &&  input.isDefault.toString() === '1' && input.updateDefault === undefined){ 
                    var taxesstr = '';
                    var endnum = response.length > 3 ? 3 : response.length
                    for(var i=0;i< endnum;i++){
                        taxesstr +="<li>"+response[i].mTaxName;
                        if(i==endnum-1 && response.length > 3){
                            taxesstr+="...+"+(response.length-endnum)+" more"
                        }
                        taxesstr+="</li>"
                    } 
                    var limsg = "<br/><ul className='errorDivs'>"+taxesstr+"</li>";
                    this.sendResponse({status:405, message:this.mDefaultTax+limsg}, res, 405)
                }
                else{  
                    if(input.updateDefault == 1){ 
                        await this.update('mTax', { isDefault: 0, updatedBy: req.userData.mEmployeeId, updatedDate: this.getDate()}, {where:{isDefault: 1, merchantId: req.deviceDetails.merchantId }},'mTaxStatus', 'id')
                    }
                    console.log(input)
                    this.create('mTax', input).then(r1=>{
                        this.sendResponse({message:"Tax details updated successfully."}, res, 200);
                    })
                }
            });
        }
    } 
    getDefaulttax= async (req,res,next)=>{ 
        var type = "default";
        var where = {
            merchantId: req.deviceDetails.merchantId,
            mTaxStatus:{
                [Sequelize.Op.ne]:2
            },
        }
        if(type === 'default'){
            where = {
                merchantId: req.deviceDetails.merchantId,
                mTaxStatus:{
                    [Sequelize.Op.ne]:2
                },
                isDefault:1
            }
        }
        let tax = await this.readAll({where: where, order: [
            ['createdDate','ASC']
        ],
        // attributes:{include: [ [
        //     Sequelize.col('mTaxId'),
        //     `id`
        // ], ]}
        }, 'mTax')
        // var tax=[];
        // // console.log("TAX SERVICE CALLED::::::")
        this.sendResponse({ data: tax}, res, 200);
        // res.send({statsu:200, data:"SUCCESS"})
    }

    getActive= async (req,res,next)=>{  
        var  where = {
                merchantId: req.deviceDetails.merchantId,
                mTaxStatus:1, 
            } 
        let tax = await this.readAll({where: where, order: [
            ['createdDate','ASC']
        ],
        // attributes:{include: [ [
        //     Sequelize.col('mTaxId'),
        //     `id`
        // ], ]}
        }, 'mTax')
        // var tax=[];
        // // console.log("TAX SERVICE CALLED::::::")
        this.sendResponse({ data: tax}, res, 200);
        // res.send({statsu:200, data:"SUCCESS"})
    }

    getAlltax= async (req,res,next)=>{ 
        var type = "all";
        var where = {
            merchantId: req.deviceDetails.merchantId,
            mTaxStatus:{
                [Sequelize.Op.ne]:2
            },
        }
        if(type === 'default'){
            where = {
                merchantId: req.deviceDetails.merchantId,
                mTaxStatus:{
                    [Sequelize.Op.ne]:2
                },
                isDefault:1
            }
        }
        let tax = await this.readAll({where: where, order: [
            ['createdDate','ASC']
        ],
        // attributes:{include: [ [
        //     Sequelize.col('mTaxId'),
        //     `id`
        // ], ]}
        }, 'mTax')
        // var tax=[];
        // // console.log("TAX SERVICE CALLED::::::")
        this.sendResponse({ data: tax}, res, 200);
        // res.send({statsu:200, data:"SUCCESS"})
    }
 
}