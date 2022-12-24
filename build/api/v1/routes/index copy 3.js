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
const authenticate = require('../middleware');
const router = express.Router(); 
var taxController = new TaxController();

router.post(`/merchant/tax/getByType/:type`,authenticate.authorizationAuth, taxController.getByType )


module.exports = router;