/* eslint-disable no-useless-constructor */
const baseController = require('../common/baseController');
const MsgController = require('../common/msgController');
 
const { Sequelize } = require('sequelize');
const sequelize =  require('../../models').sequelize
module.exports = class BatchController extends baseController{
    path = "/merchant/batch"; 
    msgController = new MsgController(); 
    routes = [];
    constructor(props){
        super(props);
    }

    initialize(){ 
        return new Promise((resolve) => {

            this.routes = [
                {
                    path:this.path+"/save",
                    type:"post",
                    method: "saveBatch",
                    authorization:'accessAuth'
                }, 
                {
                    path:this.path+"/getBatches",
                    type:"post",
                    method: "getBatches",
                    authorization:'accessAuth'
                }, 
                {
                    path:this.path+"/getBatchTickets",
                    type:"post",
                    method: "getBatchTickets",
                    authorization:'accessAuth'
                }, 
            ] 
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    } 
    

    saveBatch = async(req, res, next)=>{ 
        let batches = await this.readAll({},'batches')
        var batchname = "Batch "+(batches.length+1)
        var fromdate = req.input.from_date || this.getDate()
        var todate = req.input.to_date || this.getDate()
        var input  = {
            batchName: batchname,
            createdBy: req.userData.mEmployeeId,
            createdDate: this.getDate(),
            merchantId: req.deviceDetails.merchantId
        }
        this.create('batches', input).then(r=>{
            var batchID  = r.dataValues !== undefined ? r.dataValues.batchId : r.batchId
            this.update(`tickets`,{batchId: batchID},{where:{ticketId:{
                [Sequelize.Op.in]: sequelize.literal("(select ticketId from ticketpayment where (batchId is null or batchId='') and createdDate between '"+fromdate.substring(0, 10)+" 00:00:00' and '"+todate.substring(0, 10)+" 23:59:59')")
            }}})
            this.sendResponse({data: input}, res, 200)
        }).catch(e=>{
            this.sendResponse({message:"Error occurred. Please try again later"}, res, 400)
        })
    }


    getBatches= async(req, res, next)=>{
        var fromdate = req.input.from_date || this.getDate()
        var todate = req.input.to_date || this.getDate()
        var options = {
            where:{
                createdDate:{  
                    [Sequelize.Op.between]:[fromdate.substring(0, 10)+" 00:00:00", todate.substring(0, 10)+" 23:59:59" ]
                }
            },
            attributes:{
                include:[
                    [
                        sequelize.literal("(select count(ticketId) from tickets where batchId=`batches`.`batchId`)"),
                        'ticketCount'
                    ]
                ]
            }
        }
        this.readAll(options, 'batches').then(r=>{
            this.sendResponse({data:r}, res, 200)
        }).catch(e=>{
            this.sendResponse({message:"Error occured"}, res, 400)
        })
    }

    getBatchTickets= async(req, res, next)=>{
        var options = {
            where:{
                ticketId:{
                    [Sequelize.Op.in]:sequelize.literal("(select ticketId from tickets where batchId='"+ req.input.batchId+"')")
                }
            },
            attributes:{
                include:[
                    [
                        Sequelize.literal("(select ticketCode from tickets where ticketId=`ticketpayment`.`ticketId`)"),
                        'ticketCode'
                    ]
                ]
            }
        }

        this.readAll(options, 'ticketpayment').then(r=>{
            this.sendResponse({data:r}, res, 200)
        }).catch(e=>{
            this.sendResponse({message:"Error occured"}, res, 400)
        })
    }
}