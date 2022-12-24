const config = require('../config/settings');
const db = config.database;
const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
	const mTax = sequelize.define("mTax", {
        id:{
            field:'id',
            type: DataTypes.UUID,
            primaryKey: true,
            autoIncrement: false,
            defaultValue: DataTypes.UUIDV4
        },
        merchantId:{
            field:'merchantId',
            type: DataTypes.UUID,
            primaryKey: false,
            autoIncrement: false
        },
        mTaxId:{
            field:'mTaxId',
            type: DataTypes.UUID,
            primaryKey: false,
            autoIncrement: false,
            defaultValue: DataTypes.UUIDV4
        },
        mTaxName: {
             field: 'mTaxName', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        },
        mTaxType: {
             field: 'mTaxType', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        },
        mTaxValue: {
             field: 'mTaxValue', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false,
        },  
        mTaxStatus: {
             field: 'mTaxStatus', 
             type: DataTypes.INTEGER, 
             primaryKey: false, 
             allowNull: false ,
             defaultValue:1
        }, 
        isDefault: {
             field: 'isDefault', 
             type: DataTypes.STRING(10), 
             primaryKey: false, 
             allowNull: true,
             isDefault:'0'
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
    return mTax;
}      