const baseController = require('../common/baseController');
const MsgController = require('../common/msgController');

const express = require('express');
const authenticate = require('../../middleware/index'); 
const Sequelize = require('sequelize')
const sequelize =  require('../../models').sequelize
module.exports = class DiscountController extends baseController{
    path = "/merchant/discounts";
    router = express.Router();
    msgController = new MsgController();
    routes=[];
    constructor(props){
        super(props);
    }

    initialize(){ 
        return new Promise((resolve) => {
            this.routes = [
                {
                    path:this.path+"/get",
                    type:"post",
                    method: "getActive",
                    authorization:'accessAuth'
                }, 

                {
                    path:this.path+"/save",
                    type:"post",
                    method: "saveDiscount",
                    authorization:'accessAuth'
                }, 
                {
                    path:this.path+"/getDiscount",
                    type:"post",
                    method: "getDiscount",
                    authorization:'accessAuth'
                }, 
                {
                    path:this.path+"/updateDiscount",
                    type:"post",
                    method: "updateDiscount",
                    authorization:'accessAuth'
                }, 
            ]
            // this.router.post(this.path+"/save", authenticate.authorizationAuth, this.saveDiscount); 
            // this.router.get(this.path+"/getDiscount", authenticate.authorizationAuth, this.getDiscount); 
            // this.router.post(this.path+"/updateDiscount", authenticate.authorizationAuth, this.updateDiscount); 

            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    } 

    saveDiscount = async(req,res,next)=>{
        var input = req.input; 
        input.merchantId = req.deviceDetails.merchantId
        input.mDiscountStatus = 1;
        input.createdBy= req.userData.mEmployeeId;
        input.createdDate = this.getDate();

        input.updatedBy= req.userData.mEmployeeId;
        input.updatedDate = this.getDate(); 
        if(input.id !== undefined){
            // console.log(input)
            this.updateWithNew('mDiscounts', input, {where:{id:input.id}}, 'mDiscountStatus', 'id').then(resp=>{
                console.log("DISCOUNT UPDATED")
                this.sendResponse({message:"Updated sucessfully"}, res, 200)
            })
        }
        else{
            this.create('mDiscounts', input).then(resp=>{
                console.log("DISCOUNT SAVED")
                this.sendResponse({message:"Saved sucessfully"}, res, 200)
            })
        }
    }
    getActive= async (req,res,next)=>{ 
        let discounts = await this.readAll({order: [
            ['createdDate','ASC']
        ],
        where:{ 
            merchantId:req.deviceDetails.merchantId,
            mDiscountStatus:1,
            id:{
                [Sequelize.Op.in]:sequelize.literal("(select id from mDiscounts where mDiscountStatus!=2)")
            }
        }

        // attributes:{include: [ [
        //     Sequelize.col('mDiscountId'),
        //     `id`
        // ], ]}
        }, 'mDiscounts')
        this.sendResponse({ data: discounts}, res, 200);
    }

    getDiscount = async (req,res,next)=>{ 
        let discounts = await this.readAll({order: [
            ['createdDate','ASC']
        ],
        where:{ 
            merchantId:req.deviceDetails.merchantId,
            id:{
                [Sequelize.Op.in]:sequelize.literal("(select id from mDiscounts where mDiscountStatus!=2)")
            }
        }

        // attributes:{include: [ [
        //     Sequelize.col('mDiscountId'),
        //     `id`
        // ], ]}
        }, 'mDiscounts')
        this.sendResponse({ data: discounts}, res, 200);
    }

    updateDiscount = async(req, res,next)=>{ 
        try{
                    const input = req.input; 
        const user = req.userData;  
        var data = {
            mDiscountStatus: input.mDiscountStatus,
            updatedBy: req.userData.mEmployeeId,
            updatedDate: this.getDate()
        }
        this.update('mDiscounts', data, {where:{id:input.id}}).then(r1=>{
            this.sendResponse({message:"Discount details updated successfully."}, res, 200);
        }).catch(e=>{
            console.log(e)
        })
    }
    catch(e){
        console.log(e)
    }
    }

}