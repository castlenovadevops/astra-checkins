// const { Sequelize } = require('sequelize');
// const { applyExtraSetup } = require('./extra-setup');

// // In a real app, you should keep the database connection URL as an environment variable.
// // But for this example, we will just use a local SQLite database.
// // const sequelize = new Sequelize(process.env.DB_CONNECTION_URL);
// const settings  = require('../config/settings');
// const sequelize =  settings.database

// const modelDefiners = [
// 	// Add more models here...
// 	require('./lkup_states.model'),
// 	require('./lkup_role.model'),

// 	//MERCHANT MODELS 
// 	require('./merchant.model'),
// 	require('./merchantEmployees.model'),
// 	require('./mEmpRefMerchant.model'),
// 	require('./merchantTax.model'),
// 	require('./merchantCustomer.model'),
// 	require('./merchantDiscount.model'),
// 	require('./merchantDefaultCommission.model'),
// 	require('./merchantDefaultDiscount.model'),
// 	require('./merchantCategory.model'),
// 	require('./merchantProduct.model'),
// 	require('./mProductCategory.model'),
// 	require('./mProductTax.model'),
// 	require('./merchantEmployeeCommission.model'),
// 	require('./mEmpPermissions.model'),


// 	//POS MODELS
// 	require('./POS/mPOSDevices.model'),
// 	require('./POS/toBeSynced.model'),
// 	require('./empLog.model'),
// 	require('./POS/ticketcombined.model'),
// 	require('./POS/ticketcommission.model'),
// 	require('./POS/ticketdiscount.model'),
// 	require('./POS/ticketpayment.model'),
// 	require('./POS/tickets.model'),
// 	require('./POS/ticketservicediscount.model'),
// 	require('./POS/ticketservices.model'),
// 	require('./POS/ticketservicetax.model'),
// 	require('./POS/tickettips.model'), 
// ];

// // We define all models according to their files.
// for (const modelDefiner of modelDefiners) {
// 	modelDefiner(sequelize);
// }

// // We execute any extra setup after the models are defined, such as adding associations.
// applyExtraSetup(sequelize);

// // We export the sequelize connection instance to be used around our app.
// module.exports = sequelize;




const fs          = require('fs')
const path        = require('path')
const Sequelize   = require('sequelize')
const basename    = path.basename(__filename) 
const database    = {}

let sequelize  = new Sequelize({
    database: 'astrapos',
    username: '',
    password: '',
    host: 'localhost',
    dialect: 'sqlite',
    storage: path.join(__dirname, "../../../../../DB/astrapos.sqlite")
});


console.log("DBPATH MODELS:::::", path.join(__dirname, "../../../../../DB/astrapos.sqlite"))
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-9) === '.model.js');
  })
  .forEach((file) => {
    var model = sequelize['import'](path.resolve(__dirname, file));
    database[model.name] = model
  })


fs
.readdirSync(path.join(__dirname,"/POS"))
.filter(file => {
  return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-9) === '.model.js');
})
.forEach((file) => {
  var model = sequelize['import'](path.resolve(path.join(__dirname,"/POS/"), file));
  database[model.name] = model
})

for (var modelName in database) {
  if (database[modelName].associate) {
    database[modelName].associate(database);
  }
}

database.sequelize = sequelize
database.Sequelize = Sequelize

module.exports = database