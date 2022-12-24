/* eslint-disable no-redeclare */
/* eslint-disable no-useless-constructor */
const models = require('../../models');
const Crypto = require('../../utils/crypto');
const crypto = new Crypto();
const MsgController = require('./msgController');
  
const sequelize = require('sequelize'); 
const settings = require('../../config/settings');
const db = settings.database;
const pkfields = {
    'mTax':"id",
    "mCategory":"id",
    "mProducts":"id",
    "mDiscounts":"id",
    "mCustomers" : "mCustomerId",
    "LPSettings":"id",
    "LPActivationSettings":"id",
    "LPRedeemSettings":"id",
    "giftCards":"id",
    "customerLoyaltyPoints": "id"
}

module.exports = class baseController extends MsgController{
    models = models;

    syncTables = ["mTax", "mCategory", "mProducts", "mDiscounts", "mCustomers","LPSettings","LPActivationSettings","LPRedeemSettings", "giftCards","customerLoyaltyPoints"]

    constructor(props){
        super(props);
    }

    getDate(){
        return new Date().toISOString().replace("T"," ").replace("Z","")
    }
    

    sendResponse(response, res, status){  
        res.status(status).send(crypto.AESEncrypt(response));
    }

    generaterandomString(length) {
        const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = ' ';
        const charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength)).trim();
        }

        return result;
    }


    async readOne(options, model){
        return new Promise(async (resolve) => {
            let results =  await this.models[model].findOne(options);
            resolve(results);
        });
    }

    async readAll(options, model){
        return new Promise(async (resolve) => {
            let results =  await this.models[model].findAll(options);
            resolve(results);
        });
    } 
    
    generaterandomNumber(length) {
        const characters ='0123456789';
        let result = ' ';
        const charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength)).trim();
        }

        return result;
    }

    async create(model,data, updateTobeSync=true){ 
        return new Promise(async (resolve) => { 
            let results =  await this.models[model].create(data).catch(e=>{console.log(e)});
            if(this.syncTables.indexOf(model) !== -1 && updateTobeSync){
                console.log(results, model)
                 var pkfield = pkfields[model]
                var input = {
                    syncTable: model,
                    tableRowId: results[pkfield],
                    merchantId: data["merchantId"] || ''
                }
                await this.models["toBeSynced"].create(input);
                resolve(results)
            }
            else{
                resolve(results);
            }
        });
    }

    async delete(model, where){
        return new Promise(async (resolve) => {
            await this.models[model].destroy({
                where:  where
            })
            resolve('success')
        })
    }

    async update(model, data, where, updateTobeSync=true){ 
        return new Promise(async (resolve) => {
            let results =  await this.models[model].update(data, where);
            if(this.syncTables.indexOf(model) !== -1 && updateTobeSync){ 
                var pkfield = pkfields[model] 
                var input = {
                    syncTable: model,
                    tableRowId: data[pkfield],
                    merchantId: data["merchantId"] || ''
                }
                console.log(input)
                await this.models["toBeSynced"].create(input);
                resolve(results)
            }
            else{
                resolve(results);
            }
        });
    }

    async updateWithNew(model, data, where, statusfield, pkfield, updateTobeSync=true){ 
        return new Promise(async (resolve) => {
            await this.models[model].update({[statusfield]: 2}, where).then(async (r)=>{
                var input = Object.assign({}, data);
                delete input[pkfield];
                console.log("SAVE INPUT")
                console.log(input)
                let results = await this.models[model].create(input);
                if(this.syncTables.indexOf(model) !== -1 && updateTobeSync){ 
                    var input = {
                        syncTable: model,
                        tableRowId: data[pkfield],
                        merchantId: data["merchantId"] || ''
                    }
                    await this.models["toBeSynced"].create(input);

                    this.models["toBeSynced"].create({
                        syncTable: model,
                        tableRowId: results[pkfield],
                        merchantId:  data["merchantId"] || ''
                    }).then(r=>{ 
                        resolve(results)
                    });
                }
                else{
                    resolve(results);
                }
            })
            // let results =  await this.models[model].update(data, where);
            // resolve(results);
        });
    }  
}