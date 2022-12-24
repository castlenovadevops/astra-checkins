const MerchantController = require('../controllers/merchant/merchantController');
const CustomerController = require('../controllers/merchant/customerController');
const DiscountController = require('../controllers/merchant/discountController');
const DefaultCommissionController = require('../controllers/merchant/defaultcommissionController');
const DefaultDiscountController = require('../controllers/merchant/defaultdiscountController');
const CategoryController = require('../controllers/merchant/categoryController');
const ProductController = require('../controllers/merchant/productController');
const TaxController = require('../controllers/merchant/taxController');
const MerchantEmployeeController = require('../controllers/merchant/employeeController');
const MEmployeeManager = require('../controllers/merchant/employeeManager');
const MEmployeeCommissionController = require('../controllers/merchant/employeeCommissionController');
const MProfileController = require('../controllers/merchant/profileController');
const express = require('express');
const path = require('path');

const cors = require('cors')
const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
 }
module.exports = class RoutesController{
    app;
    contollers = [

        // MERCHANT CONTROLLERS
        new MerchantController(),
        new CustomerController(),
        new DiscountController(),
        new DefaultCommissionController(),
        new DefaultDiscountController(),
        new CategoryController(),
        new ProductController(),
        new TaxController(),
        new MerchantEmployeeController(),
        new MEmployeeManager(),
        new MEmployeeCommissionController(),
        new MProfileController()
    ] 
    initialize(){
        return new Promise((resolve) => {
        this.initializeControllers(0, resolve);
        });
    }

    initializeControllers(index, resolve){
        if(index < this.contollers.length){
            var controller = this.contollers[index]; 
            controller.initialize().then(r=>{ 
                this.app.use("/api/v1/",cors(corsOptions), controller.router);
                this.initializeControllers(index+1, resolve);
            })
        }
        else{
            // console.log("ALL API REGISTEREd")
            
            this.app.use('/static/css',express.static(path.join(__dirname,'../../../../static/css')));
            this.app.use('/static/js',express.static(path.join(__dirname,'../../../../static/js')));
            this.app.use('/static/icons',express.static(path.join(__dirname,'../../../../static/icons')));
            this.app.use('/static/illustrations',express.static(path.join(__dirname,'../../../../static/illustrations')));
            this.app.use('/static/media',express.static(path.join(__dirname,'../../../../static/media')));
            this.app.use('/static/images',express.static(path.join(__dirname,'../../../../static/mock-images')));
            // app.get('/api/v1/*', routes);
            // this.app.use('/*', function (req, res) {
            // res.sendFile(path.resolve(__dirname+'../../../../index.html'));
            // });

            this.app.use("/", (req,res)=>{ 
               
                res.sendFile(path.resolve(__dirname+'../../../../index.html'));
            })

            this.app._router.stack.forEach(function(r){
  if (r.route && r.route.path){
    // console.log(r.route.path)
  }
})
            resolve("success");
            // res.send({msg:"Initial route called"});
        }
    }
}