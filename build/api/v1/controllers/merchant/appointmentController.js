/* eslint-disable no-useless-constructor */
const baseController = require('../common/baseController');
const MsgController = require('../common/msgController');
 
const find = require('local-devices');
const Sequelize = require('sequelize')
const sequelize =  require('../../models').sequelize
const APIManager = require('../../utils/apiManager'); 
module.exports = class AppointmentController extends baseController{
    apimanager = new APIManager();
    path = "/merchant/appointment"; 
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
                    method: "saveAppointment",
                    authorization:'accessAuth'
                },
                {
                    path:this.path+"/getAppointmentsByDate",
                    type:"post",
                    method: "getAppointmentsByDate",
                    authorization:'accessAuth'
                },
                {
                    path:this.path+"/getAppointmentsList",
                    type:"post",
                    method: "getAppointmentsList",
                    authorization:'accessAuth'
                }
                
            ] 
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    } 
    

    saveAppointment = async(req, res, next)=>{
        var thisobj = this;
        find().then(devices => {
            console.log(devices)
            devices.forEach(d=>{ 
                thisobj.apimanager.postRequest(`http://`+d.ip+":1818/api/v1/pos/checkins/saveAppointment", req.input, req).then(r=>{

                })
            })
          }).catch(e=>{
            thisobj.sendResponse({message:"Error"}, res, 400)
          })

        this.saveAppointmentServices(0, req, res, next)
    }

    saveAppointmentServices = async(i, req, res, next, parentappid='')=>{
        console.log(Object.keys(req.input.data.selectedServices), i)
        var keys = Object.keys(req.input.data.selectedServices)
        if(i < keys.length){
            var obj = keys[i]
            console.log(obj)
            if(obj !== '' && obj !== undefined){
                var appinput = {
                    appointmentBookedBy: '',
                    createdDate: this.getDate(),
                    appointmentDate:req.input.data.showingCustomerForm.appointmentdate,
                    appointmentTime:req.input.data.showingCustomerForm.appointmenttime,
                    recordType:'Appointment'
                }
            
                if(obj.indexOf('Guest') === -1){
                    appinput["customerId"] = req.input.data.showingCustomerForm.customerDetail.mCustomerId
                    appinput["parentId"] = ''
                    appinput["appointmentStatus"] = 'Booked'
                }
                else{ 
                    appinput["guestName"] = obj
                    appinput["parentId"] = parentappid
                    appinput["appointmentStatus"] = 'Booked'
                }

                this.create('appointments', appinput).then(async (r)=>{
                    if(obj.indexOf('Guest') === -1){ 
                        parentappid = r.dataValues.appointmentId || r.appointmentId
                    }
                    var appointmentid = r.dataValues.appointmentId || r.appointmentId
                    this.saveAppointmentIndividualServices(0,req.input.data.selectedServices[obj], i, req,res, next, parentappid, appointmentid)
                })
            }
            else{
                this.sendResponse({message:"Appointment saved successfully."}, res, 200)
            }
        }

        else{
            this.sendResponse({message:"Appointment saved successfully."}, res, 200)
        }
    }

    saveAppointmentIndividualServices = async(j, services, i, req,res, next, parentappid, appointmentid)=>{
        console.log("SERVICEs ", services, j)
        if(j < services.length){
            var input = {
                appointmentId: appointmentid,
                serviceId: services[j].mProductId,
                technicianId: services[j].technicianId,
                serviceDuration: services[j].duration
            }

            this.create('appointmentServices', input).then(r=>{
                this.saveAppointmentIndividualServices(j+1,services, i, req,res, next, parentappid, appointmentid)
            })
        }
        else{
            this.saveAppointmentServices(i+1, req, res, next, parentappid)
        }
    }


    getAppointmentsByDate = async(req, res, next)=>{
        // id: 1,
//         name: "Holiday",
//         dateFrom: "2021-09-29T12:00",
//         dateTo: "2022-12-03T08:45",
//         meta: SAMPLE_META,
//         type: "Holiday"

        this.readAll({
            group: [
                ['appointmentDate'] 
            ],
            where:{
                parentId:{
                    [Sequelize.Op.in]:[null, '']
                }
            },
            attributes:[
                [Sequelize.col("`appointmentDate`"), 'appointmentDate'],
                [Sequelize.col("`appointmentDate`"), 'dateFrom'],
                [Sequelize.col("`appointmentDate`"), 'dateTo'],
                [Sequelize.fn('count', Sequelize.col('appointmentId')), 'name'],
                [Sequelize.literal("'Holiday'"), 'type']
            ]
        }, `appointments`).then(apps=>{
            this.sendResponse({data: apps}, res, 200)
        })
    }

    getAppointmentsList = async(req,res, next)=>{
        this.readAll({
            where:{
                appointmentDate:req.input.date.substring(0,10),
                parentId:{
                    [Sequelize.Op.in]:[null, '']
                }
                // {
                //     [Sequelize.Op.like]: req.input.date.substring(0,10)+'%'
                // }
            },
            attributes:{
                include:[
                    [
                        sequelize.literal("(select mCustomerName from mCustomers where mCustomerId=`appointments`.`customerId`)"),
                        "customerName"
                    ]
                ]
            }
        }, `appointments`).then(apps=>{
            this.sendResponse({data: apps}, res, 200)
        })
    }
}