const CustomerController = require('../controllers/merchant/customerController');
const DiscountController = require('../controllers/merchant/discountController');
const DefaultCommissionController = require('../controllers/merchant/defaultcommissionController');
const DefaultDiscountController = require('../controllers/merchant/defaultdiscountController');
const CategoryController = require('../controllers/merchant/categoryController');
const ProductController = require('../controllers/merchant/productController');
const TaxController = require('../controllers/merchant/taxController');
const MerchantEmployeeController = require('../controllers/merchant/employeeController');
const MEmployeeCommissionController = require('../controllers/merchant/employeeCommissionController');
const CommonController = require('../controllers/common/commonController');
const LoyaltyPointSettingsController = require('../controllers/merchant/loyaltyPointsController');
const GiftCardsController = require('../controllers/merchant/giftCardController');

const SyncController = require('../controllers/pos/syncCodeController');
const SyncTaxController = require('../controllers/pos/syncTaxController');
const SyncCategoryController = require('../controllers/pos/syncCategoryController');
const SyncProductController = require('../controllers/pos/syncProductsController');
const SyncDiscountController = require('../controllers/pos/syncDiscountsController')
const SyncDefaultDiscountController = require('../controllers/pos/syncDefaultDiscountController');
const SyncDefaultCommissionController = require('../controllers/pos/syncDefaultCommissionController');
const SyncEmployeesController = require('../controllers/pos/syncEmployeeController');
const SyncCustomerController = require('../controllers/pos/syncCustomerController');
const SyncLPSettingsController = require('../controllers/pos/syncLPSettingsController');
const SyncLPActivationSettings = require('../controllers/pos/syncLPActivationSettingsController');
const SyncLPRedeemSettings = require('../controllers/pos/syncLPRedeemSettingsController');
const SyncGiftCardsSettings = require('../controllers/pos/syncGiftCardsController');

const ClockInController = require('../controllers/merchant/clockinController');
const TicketController = require('../controllers/merchant/ticketController');
const SaveTicketController = require('../controllers/merchant/saveticketController');
const TransferController = require('../controllers/merchant/transferController')
const PaymentController = require('../controllers/merchant/paymentController')
const TransactionController = require('../controllers/merchant/transactionsController');
const PayoutController = require('../controllers/merchant/payoutController');
const ReportController = require('../controllers/merchant/reportController');
const TicketInfoController = require('../controllers/merchant/ticketinfoController');
const CombineController = require('../controllers/merchant/combineController');

const PrintController = require('../controllers/print/printController');
const CheckInController = require('../controllers/checkins/checkInController');
const AppointmentController = require('../controllers/merchant/appointmentController')
const BatchController = require('../controllers/merchant/batchController');
const WaitinglistController = require('../controllers/merchant/waitinglistController');


const express = require('express');
const path = require('path');

const cors = require('cors');
const authenticate = require('../middleware');
const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
 } 
   var router = express.Router();
    var contollers = [

        new CommonController(),

        // MERCHANT CONTROLLERS
        new CustomerController(),
        new DiscountController(),
        new DefaultCommissionController(),
        new DefaultDiscountController(),
        new CategoryController(),
        new ProductController(),
        new TaxController(),
        new MerchantEmployeeController(), 
        new MEmployeeCommissionController(), 
        new ClockInController(),
        new TicketController(),
        new SaveTicketController(),
        new TransferController(),
        new PaymentController(),
        new TransactionController(),
        new PayoutController(),
        new ReportController(),
        new TicketInfoController(),
        new CombineController(),
        new LoyaltyPointSettingsController(),
        new GiftCardsController(),
        
        new SyncController(),
        new SyncTaxController(),
        new SyncCategoryController(),
        new SyncProductController(),
        new SyncDiscountController(),
        new SyncDefaultDiscountController(),
        new SyncDefaultCommissionController(),
        new SyncEmployeesController(),
        new SyncCustomerController(),
        new SyncLPSettingsController(),
        new SyncLPActivationSettings(),
        new SyncLPRedeemSettings(),
        new SyncGiftCardsSettings(),

        new PrintController(),
        new CheckInController(),
        new AppointmentController(),
        new BatchController(),
        new WaitinglistController()
    ] 
    function initialize(){ 
            initializeControllers(0); 
    }

    function initializeControllers(index){
        if(index < contollers.length){
            var controller = contollers[index]; 
            controller.initialize().then(r=>{ 
                // app.use("/api/v1/",cors(corsOptions), controller.router);
                initializeRoutes(0,controller.routes, index);
                // 
            })
        }
        else{
            // console.log("ALL API REGISTEREd", router)  
        }
    }

   function initializeRoutes(idx, routes, index ){
    // console.log("IDX", idx)
        if(idx < routes.length){
            var controller = contollers[index];
            var route = Object.assign({},routes[idx])
            if(route !== undefined){
                if(route.authorization !== undefined && route.authorization !== ''){
                    if(route.type === 'post'){
                        router.post(route.path, authenticate[route.authorization], controller[route.method]);
                    }
                    else{      
                        router.get(route.path, authenticate[route.authorization],  controller[route.method]);
                    }
                }
                else{
                    if(route.type === 'post'){ 
                        router.post(route.path, controller[route.method]);
                    }
                    else{ 
                        router.get(route.path, controller[route.method]);
                    }
                }
            }
            else{
                // console.log("ELSE CONN 92 D")
            }
            initializeRoutes(idx+1, routes, index);
        }
        else{
            initializeControllers(index+1);
        }
    }
    initialize();
    module.exports = router;