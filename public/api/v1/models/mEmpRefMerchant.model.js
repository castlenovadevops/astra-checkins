const config = require('../config/settings');
const db = config.database;
const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
	const mEmpRefMerchant = sequelize.define("mEmpRefMerchant", {
        id:{
            field:'id',
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        merchantId:{
            field:'merchantId',
            type: DataTypes.UUID,
            primaryKey: false,
            autoIncrement: false
        },
        mEmployeeId: {
             field: 'mEmployeeId', 
             type: DataTypes.UUID, 
             primaryKey: false, 
             allowNull: false 
        },
        mEmployeeRole: {
             field: 'mEmployeeRole', 
             type: DataTypes.UUID, 
             primaryKey: false, 
             allowNull: false 
        },
        mEmployeePasscode: {
             field: 'mEmployeePasscode', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false,
        },  
        mEmployeeStatus: {
             field: 'mEmployeeStatus', 
             type: DataTypes.INTEGER, 
             primaryKey: false, 
             allowNull: false ,
             defaultValue:1
        }, 
        createdBy: {
             field: 'createdBy', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: true 
        },
        createdDate: {
             field: 'createdDate', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: true 
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

    return mEmpRefMerchant;
}      