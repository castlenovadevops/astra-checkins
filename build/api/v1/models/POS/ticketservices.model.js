const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
	const ticketservices = sequelize.define("ticketservices", {
          ticketServiceId:{
               field:'ticketServiceId',
               type: DataTypes.UUID,
               primaryKey: true,
               defaultValue: DataTypes.UUIDV4
           },
           ticketId:{
               field:'ticketId',
               type: DataTypes.UUID,
               primaryKey: true
           }, 
           serviceId: {
                field: 'serviceId', 
                type: DataTypes.STRING(255), 
                primaryKey: false, 
                allowNull: false,
           }, 
           serviceTechnicianId: {
                field: 'serviceTechnicianId', 
                type: DataTypes.STRING(255), 
                primaryKey: false, 
                allowNull: false,
           }, 
           serviceQty: {
                field: 'serviceQty', 
                type: DataTypes.STRING(255), 
                primaryKey: false, 
                allowNull: false,
           }, 
           serviceOriginalPrice: {
                field: 'serviceOriginalPrice', 
                type: DataTypes.STRING(255), 
                primaryKey: false, 
                allowNull: false,
           }, 
           servicePerUnitCost: {
                field: 'servicePerUnitCost', 
                type: DataTypes.STRING(255), 
                primaryKey: false, 
                allowNull: false,
           }, 
           servicePrice: {
                field: 'servicePrice', 
                type: DataTypes.STRING(255), 
                primaryKey: false, 
                allowNull: false,
           },
           serviceNotes: {
                field: 'serviceNotes', 
                type: DataTypes.STRING(255), 
                primaryKey: false, 
                allowNull: false,
           }, 
           splitFrom: {
                field: 'splitFrom', 
                type: DataTypes.STRING(255), 
                primaryKey: false, 
                allowNull: false,
           }, 
           combinedFrom: {
                field: 'combinedFrom', 
                type: DataTypes.STRING(255), 
                primaryKey: false, 
                allowNull: false,
           }, 
           transferredFrom: {
                field: 'transferredFrom', 
                type: DataTypes.STRING(255), 
                primaryKey: false, 
                allowNull: false,
           }, 
           isSpecialRequest:{
             field: 'isSpecialRequest', 
             type: DataTypes.INTEGER, 
             primaryKey: false, 
             allowNull: false,
           },
           status:{
             field: 'status', 
             type: DataTypes.INTEGER, 
             primaryKey: false, 
             allowNull: false,
             defaultValue:1
           },
           createdDate: {
                field: 'createdDate', 
                type: DataTypes.STRING(255), 
                primaryKey: false, 
                allowNull: false,
           },
           createdBy: {
                field: 'createdBy', 
                type: DataTypes.STRING(255), 
                primaryKey: false, 
                allowNull: false,
           }
    }, {
      freezeTableName: true,
      timestamps: false,
      createdAt: false,
      updatedAt: false,
      deletedAt: false
    })

    ticketservices.associate = function(models){

     models.mProducts.hasMany(models.ticketservices, {foreignKey: 'serviceId',sourceKey: 'mProductId'});
     models.ticketservices.belongsTo(models.mProducts, {foreignKey: 'serviceId',targetKey: 'mProductId'});

     models.merchantEmployees.hasMany(models.ticketservices, {foreignKey: 'serviceTechnicianId',sourceKey: 'mEmployeeId'});
     models.ticketservices.belongsTo(models.merchantEmployees, {foreignKey: 'serviceTechnicianId',targetKey: 'mEmployeeId'});

     models.ticketservices.hasMany(models.ticketservicetax, {foreignKey: 'ticketServiceId',sourceKey: 'ticketServiceId'});
     models.ticketservicetax.belongsTo(models.ticketservices, {foreignKey: 'ticketServiceId',targetKey: 'ticketServiceId'});
     

     models.ticketservices.hasMany(models.ticketservicediscount, {foreignKey: 'ticketServiceId',sourceKey: 'ticketServiceId'});
     models.ticketservicediscount.belongsTo(models.ticketservices, {foreignKey: 'ticketServiceId',targetKey: 'ticketServiceId'});

     models.ticketservices.hasMany(models.ticketcommission, {foreignKey: 'ticketServiceId',sourceKey: 'ticketServiceId'});
     models.ticketcommission.belongsTo(models.ticketservices, {foreignKey: 'ticketServiceId',targetKey: 'ticketServiceId'});
 
     models.ticketservices.hasMany(models.ticketservicediscountcommission, {foreignKey: 'ticketServiceId',sourceKey: 'ticketServiceId'});
     models.ticketservicediscountcommission.belongsTo(models.ticketservices, {foreignKey: 'ticketServiceId',targetKey: 'ticketServiceId'});
 
     models.ticketservices.hasMany(models.ticketTips, {foreignKey: 'ticketServiceId',sourceKey: 'ticketServiceId'});
     models.ticketTips.belongsTo(models.ticketservices, {foreignKey: 'ticketServiceId',targetKey: 'ticketServiceId'}); 
    }

    return ticketservices;
}      