/* eslint-disable no-redeclare */
/* eslint-disable no-useless-constructor */
const baseController = require('../common/baseController');
const MsgController = require('../common/msgController');

const jwt = require("jsonwebtoken");
const  {jwtOptions} = require('../../config/jwtOptions')
const express = require('express');
const authenticate = require('../../middleware/index');  
const Sequelize = require('sequelize')
const sequelize =  require('../../models').sequelize
module.exports = class EmployeeController extends baseController{
    path = "/merchant/employee";
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
                    path:this.path+"/login",
                    type:"post",
                    method: "loginEmployee",
                    authorization:'accessAuth'
                },
                {
                    path:this.path+"/save",
                    type:"post",
                    method: "save",
                    authorization:'accessAuth'
                },
                {
                    path:this.path+"/getMerchants",
                    type:"post",
                    method: "getMerchants",
                    authorization:'accessAuth'
                },{
                    path:this.path+"/get",
                    type:"post",
                    method: "get",
                    authorization:'accessAuth'
                },{
                    path:this.path+"/getAll",
                    type:"post",
                    method: "getAll",
                    authorization:'accessAuth'
                },{
                    path:this.path+"/update",
                    type:"post",
                    method: "updateEmployee",
                    authorization:'accessAuth'
                },{
                    path:this.path+"/getByPasscode",
                    type:"post",
                    method: "getByPasscode",
                    authorization:'accessAuth'
                }
            ]
            // this.router.post(this.path+"/save", authenticate.accessAuth, this.saveCustomer); 
            // this.router.get(this.path+"/getMerchants", authenticate.authorizationAuth, this.getMerchants); 
            // this.router.post(this.path+"/save", authenticate.authorizationAuth, this.save); 
            // this.router.get(this.path+"/get", authenticate.authorizationAuth, this.get); 
            // this.router.get(this.path+"/getAll", authenticate.authorizationAuth, this.getAll); 
            // this.router.post(this.path+"/update", authenticate.authorizationAuth, this.updateEmployee); 
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    } 

    getMerchants=async(req, res, next)=>{
        var options = {
            where:{
                mEmployeeId: req.userData.mEmployeeId,
                mEmployeeStatus:1
            },
            attributes:{
                include:[
                    [
                        sequelize.literal("(select merchantName from merchant where merchantId = `mEmpRefMerchant`.`merchantId` )"),
                        'merchantName'
                    ],

                    [
                        sequelize.literal("(select roleName from lkup_role where roleId = `mEmpRefMerchant`.`mEmployeeRole` )"),
                        'mEmployeeRoleName'
                    ]
                ]
            }
        }
        this.readAll(options, `mEmpRefMerchant`).then(merchants=>{
            this.sendResponse({data: merchants}, res, 200)
        })
    }

    save = async(req,res,next)=>{
        var input = req.input;
        input.merchantId = req.deviceDetails.merchantId;
        input.mEmployeeStatus = '1';
        input.createdBy= req.userData.mEmployeeId;
        input.createdDate = this.getDate();

        input.updatedBy= req.userData.mEmployeeId;
        input.updatedDate = this.getDate(); 

        // console.log(input)
        if(input.mEmployeeEmail !== ''){
            this.readOne({where:{email: input.mEmployeeEmail}}, 'email_index').then(async (emailRecord)=>{
                if(emailRecord !== null && emailRecord.recordType === 'CN'){
                    return this.sendResponse({message: this.cnemployeeexist, field:'mEmployeeEmail'}, res, 400)
                }
                else if(emailRecord !== null && emailRecord.recordType === 'MA'){
                    return this.sendResponse({message: this.cnmaexist, field:'mEmployeeEmail'}, res, 400)
                }
                else if(emailRecord !== null && emailRecord.recordType === 'A'){
                    return this.sendResponse({message: this.cnaexist, field:'mEmployeeEmail'}, res, 400)
                }
                else if(emailRecord !== null &&  emailRecord.recordType === 'M'){
                    var userdetails = await this.getUserDetailByEmail(input.mEmployeeEmail, emailRecord, res);
                    // console.log(input.mEmployeeEmail, userdetails)
                    if(input.mEmployeeRole === 'Admin'){
                        var options = {where:{ 
                            mEmployeeRole: {
                                [Sequelize.Op.in]:sequelize.literal("(select roleId from lkup_role where (roleName='Employee' or roleName='Owner') and merchantId is not null and merchantId!='')")
                            }
                        }}
                        if(input.id !== undefined){
                            options = {where:{
                                mEmployeeId:input.id,
                                mEmployeeRole: {
                                    [Sequelize.Op.in]:sequelize.literal("(select roleId from lkup_role where (roleName='Employee' or roleName='Owner') and merchantId is not null and merchantId!='')")
                                }
                            }}
                        }
                        this.readAll(options, 'mEmpRefMerchant').then(rec=>{
                            if(rec.length > 0){
                                return this.sendResponse({message:this.memployeeEmpexist, field:'mEmployeeEmail'}, res, 400)
                            }
                            else{
                                this.checkPasscode(input, req, res , next)
                            }
                        })
                    }
                    else if(input.mEmployeeRole === 'Employee'){
                        var  options = {where:{ 
                            mEmployeeRole: {
                                [Sequelize.Op.in]:sequelize.literal("(select roleId from lkup_role where (roleName='Admin' or roleName='Owner') and merchantId is not null and merchantId!='')")
                            }
                        }}
                        if(input.id !== undefined){
                            options = {where:{
                                mEmployeeId:input.id,
                                mEmployeeRole: {
                                    [Sequelize.Op.in]:sequelize.literal("(select roleId from lkup_role where (roleName='Admin' or roleName='Owner') and merchantId is not null and merchantId!='')")
                                }
                            }}
                        }
                        this.readAll(options, 'mEmpRefMerchant').then(rec=>{
                            if(rec.length > 0){
                                return this.sendResponse({message:this.memployeeAdminexist, field:'mEmployeeEmail'}, res, 400)
                            }
                            else{
                                this.checkPasscode(input, req, res , next)
                            }
                        })
                    }
                }
                else{
                    this.checkPasscode(input, req, res, next);
                }
            })
        }
        else{
            this.checkPasscode(input, req, res, next);
        }
    }

    checkPasscode = async(input, req, res, next)=>{
        var options = {
            where:{
                mEmployeePasscode: input.mEmployeeCode,
                merchantId: req.deviceDetails.merchantId
            }
        }
        if(input.id){
            options.where ={
                mEmployeeId:{
                    [Sequelize.Op.ne]: input.id
                },
                mEmployeePasscode: input.mEmployeeCode,
                merchantId: req.deviceDetails.merchantId
            }
        }

        this.readAll(options, 'mEmpRefMerchant').then(results=>{
            if(results.length > 0){
                return this.sendResponse({message:this.mempPasscodeExist, field:'mEmployeeCode'}, res, 400)
            }
            else{
                this.saveEmpDetail(input, req, res, next)
            }
        })
    }

    saveEmpDetail = async(input, req, res, next)=>{
        if(input.id !== undefined){
            this.update('merchantEmployees', input, {where:{mEmployeeId :input.id}}).then(resp=>{
                this.update('mEmpRefMerchant', {mEmployeePasscode: input.mEmployeeCode, mEmployeeRole: input.mEmployeeRole, 
                    updatedBy: req.userData.mEmployeeId,
                    updatedDate: this.getDate()}, {where:{mEmployeeId: input.id, merchantId: req.deviceDetails.merchantId}}).then(resp=>{
                    this.sendResponse({message:"Updated sucessfully"}, res, 200)
                })
            })
        }
        else{
            this.create('merchantEmployees', input).then(resp=>{
                var refinput = {
                    merchantId: req.deviceDetails.merchantId,
                    mEmployeeId: resp.mEmployeeId,
                    mEmployeeRole: input.mEmployeeRole,
                    mEmployeePasscode: input.mEmployeeCode,
                    createdBy: req.userData.mEmployeeId,
                    createdDate: this.getDate()
                }
                this.create('mEmpRefMerchant', refinput).then(resp=>{
                    this.saveEmployeeCommission(refinput, req, res, next)
                })
            })
        }
    }

    saveEmployeeCommission = async(refinput, req, res, next)=>{
        var merchantId = refinput.merchantId
        var mEmployeeId = refinput.mEmployeeId
        this.readOne({where:{
            merchantId: merchantId,
            status:1
        }}, 'mDefaultCommission').then(commission=>{
            if(commission){ 
                var empInput = {
                    merchantId: merchantId,
                    mEmployeeId: mEmployeeId,
                    minimumSalary:'',
                    mOwnerPercentage: commission.mOwnerPercentage,
                    mEmployeePercentage: commission.mEmployeePercentage,
                    mCashPercentage: commission.mCashPercentage,
                    mCheckPercentage: commission.mCheckPercentage,
                    mTipsCashPercentage: commission.mTipsCashPercentage,
                    mTipsCheckPercentage: commission.mTipsCheckPercentage,
                    createdBy: req.userData.mEmployeeId,
                    updatedBy: req.userData.mEmployeeId,
                    createdDate: this.getDate(),
                    updatedDate: this.getDate()
                } 
                this.update('mEmployeeCommission', {status:0, updatedDate: this.getDate(), updatedBy: req.userData.mEmployeeId}, {where:{merchantId: req.deviceDetails.merchantId, mEmployeeId: empInput.mEmployeeId, status:1}}).then(r=>{
                    this.create('mEmployeeCommission', empInput).then(r=>{
                        this.sendResponse({message:"Saved successfully."}, res, 200);
                    })
                })
            }
            else{
                this.sendResponse({message:"Saved successfully"}, res, 200)
            }
        })
    }

    get = async (req,res,next)=>{ 
        let customers = await this.readAll({order: [
            ['createdDate','ASC']
        ],
        attributes:{include: [ 
            [
                Sequelize.col('`merchantEmployees`.`mEmployeeId`'),
                `id`
            ],
            // [
            //     sequelize.literal("(select roleName from lkup_role where roleId = (select mEmployeeRole from mEmpRefMerchant where merchantId='"+req.deviceDetails.merchantId+"' and mEmployeeId=`merchantEmployees`.`mEmployeeId`) )"),
            //     `mEmployeeRoleName`
            // ],
            // [
            //     sequelize.literal("(select mEmployeeRole from mEmpRefMerchant where merchantId='"+req.deviceDetails.merchantId+"' and mEmployeeId=`merchantEmployees`.`mEmployeeId`)"),
            //     `mEmployeeRole`
            // ],
            // [
            //     sequelize.literal("(select mEmployeeStatus from mEmpRefMerchant where merchantId='"+req.deviceDetails.merchantId+"' and mEmployeeId=`merchantEmployees`.`mEmployeeId`)"),
            //     `mEmployeeStatus`
            // ],
            // [
            //     sequelize.literal("(select mEmployeePasscode from mEmpRefMerchant where merchantId='"+req.deviceDetails.merchantId+"' and mEmployeeId=`merchantEmployees`.`mEmployeeId`)"),
            //     `mEmployeeCode`
            // ],
        ]
    },
        where:{
            mEmployeeRoleName: {
                [Sequelize.Op.ne] : 'Owner'
            }
        },
        include:[
            {
                model:this.models.mEmployeeCommission,
                where:{status:1, merchantId: req.deviceDetails.merchantId},
                required: false 
            }
        ]
        }, 'merchantEmployees')
        this.sendResponse({ data: customers}, res, 200);
    }


    getAll = async (req,res,next)=>{ 
        let customers = await this.readAll({order: [
            ['createdDate','ASC']
        ],
    //     attributes:{include: [ 
    //         [
    //             Sequelize.col('`merchantEmployees`.`mEmployeeId`'),
    //             `id`
    //         ],
    //         [
    //             sequelize.literal("(select roleName from lkup_role where roleId = (select mEmployeeRole from mEmpRefMerchant where merchantId='"+req.deviceDetails.merchantId+"' and mEmployeeId=`merchantEmployees`.`mEmployeeId`) )"),
    //             `mEmployeeRoleName`
    //         ],
    //         [
    //             sequelize.literal("(select mEmployeeRole from mEmpRefMerchant where merchantId='"+req.deviceDetails.merchantId+"' and mEmployeeId=`merchantEmployees`.`mEmployeeId`)"),
    //             `mEmployeeRole`
    //         ],
    //         [
    //             sequelize.literal("(select mEmployeeStatus from mEmpRefMerchant where merchantId='"+req.deviceDetails.merchantId+"' and mEmployeeId=`merchantEmployees`.`mEmployeeId`)"),
    //             `mEmployeeStatus`
    //         ],
    //         [
    //             sequelize.literal("(select mEmployeePasscode from mEmpRefMerchant where merchantId='"+req.deviceDetails.merchantId+"' and mEmployeeId=`merchantEmployees`.`mEmployeeId`)"),
    //             `mEmployeeCode`
    //         ],
    //     ]
    // },
        // where:{
        //      mEmployeeId: {
        //         [Sequelize.Op.in] : sequelize.literal("(select mEmployeeId from mEmpRefMerchant where merchantId='"+req.deviceDetails.merchantId+"' )")
        //     }
        // },
        include:[
            {
                model:this.models.mEmployeeCommission,
                where:{status:1, merchantId: req.deviceDetails.merchantId},
                required: false 
            }
        ]
        }, 'merchantEmployees')
        this.sendResponse({ data: customers}, res, 200);
    }


    updateEmployee = async(req, res,next)=>{ 
        const input = req.input; 
        const user = req.userData;  
        // console.log(input)
        var data = {
            mEmployeeStatus: input.mEmployeeStatus,
            updatedBy: user.id,
            updatedDate: this.getDate()
        }
        this.update('merchantEmployees', data, {where:{mEmployeeId:input.id}}).then(r1=>{
            this.sendResponse({message:"Customer details updated successfully."}, res, 200);
        })
    }


    loginEmployee = async(req,res, next)=>{
        if(req.input.passCode !== ''){
            let options={
                where:{mEmployeePasscode: req.input.passCode, mEmployeeStatus:1},
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
                        ]
                    ]
                }
            }
            this.readOne( options, 'merchantEmployees').then(results=>{
                if(results !== null){
                    var userData = Object.assign({}, results.dataValues||results); 
                    let payload = { ...userData  }; 
                    this.update('empLog', {status:2}, {where:{mEmployeeId: userData.mEmployeeId, status:1}} ,true).then(results=>{
                        let loginput = {
                            mEmployeeId:userData.mEmployeeId,
                            clockedInOn: this.getDate(),
                            status:1,
                            clockedOutOn:''
                        }
                        this.create('empLog', loginput, true).then(results=>{
                            // console.log(payload)
                            let token = jwt.sign(payload, jwtOptions.secretOrKey); 
                            return this.sendResponse({  token:token, data: userData}, res, 200);
                        })
                    }) 

                }
                else{
                    this.sendResponse({message:"Invalid passcode. Please try again later."}, res, 400)
                }
            })
        }
        else{
            this.sendResponse({message:"Please enter the passcode."}, res, 400)
        }
    }

    getByPasscode = async(req, res)=>{
        if(req.input.passCode !== ''){
            let options={
                where:{mEmployeePasscode: req.input.passCode, mEmployeeStatus:1},
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
                        ]
                    ]
                }
            }
            this.readOne( options, 'merchantEmployees').then(results=>{
                console.log(results);
                if(results !== null){
                    var userData = Object.assign({}, results.dataValues||results);  
                    return this.sendResponse({ data: userData}, res, 200);
                }
                else{
                    this.sendResponse({message:"Invalid passcode. Please try again later."}, res, 400)
                }
            })
        }
        else{
            this.sendResponse({message:"Please enter the passcode."}, res, 400)
        }
    }

}