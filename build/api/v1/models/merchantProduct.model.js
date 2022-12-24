const config = require('../config/settings');
const db = config.database;
const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
	const mProducts = sequelize.define("mProducts", {
        id:{
            field:'id',
            type: DataTypes.UUID,
            primaryKey: true,
            autoIncrement: false,
            defaultValue: DataTypes.UUIDV4
        },
        mProductId:{
            field:'mProductId',
            type: DataTypes.UUID,
            primaryKey: true,
            autoIncrement: false,
            defaultValue: DataTypes.UUIDV4
        },
        merchantId: {
          field: 'merchantId', 
          type:  DataTypes.UUID,
          primaryKey: false, 
          allowNull: false,
          },
        mProductName: {
            field: 'mProductName', 
            type: DataTypes.STRING(255), 
            primaryKey: false, 
            allowNull: false 
        },
        mProductType: {
             field: 'mProductType', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        },
        mProductSKU: {
             field: 'mProductSKU', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        },
        mProductCode: {
             field: 'mProductCode', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false,
        },
       
        mProductPriceType: {
             field: 'mProductPriceType', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        },
        mProductPrice: {
             field: 'mProductPrice', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: true 
        },
        mProductCost: {
             field: 'mProductCost', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        },
        mProductDescription: {
             field: 'mProductDescription', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        },
        mProductTaxType: {
             field: 'mProductTaxType', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        },
        mProductStatus: {
             field: 'mProductStatus', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        }, 
        
        createdBy: {
             field: 'createdBy', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        },
        createdDate: {
             field: 'createdDate', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        },
        updatedBy: {
             field: 'updatedBy', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: true 
        },
        updatedDate: {
             field: 'updatedDate', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: true 
        },
    }, {
      freezeTableName: true,
      timestamps: false,
      createdAt: false,
      updatedAt: 'updatedDate',
      deletedAt: false
    })
    return mProducts;
}      