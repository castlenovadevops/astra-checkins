const config = require('../config/settings');
const db = config.database;
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const mDefaultCommission = sequelize.define("mDefaultCommission", {
        id:{
            field:'id',
            type: DataTypes.UUID,
            primaryKey: true,
            autoIncrement: false,
            defaultValue: DataTypes.UUIDV4
        },
        merchantId: {
            field: 'merchantId', 
            type: DataTypes.STRING(255), 
            primaryKey: false, 
            allowNull: false,
        },
        mOwnerPercentage: {
             field: 'mOwnerPercentage', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        },
        mEmployeePercentage: {
             field: 'mEmployeePercentage', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        },
        mCashPercentage: {
             field: 'mCashPercentage', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false,
        },  
        mCheckPercentage: {
             field: 'mCheckPercentage', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false ,
             defaultValue:1
        }, 
        mTipsCashPercentage: {
            field: 'mTipsCashPercentage', 
            type: DataTypes.STRING(255), 
            primaryKey: false, 
            allowNull: false,
        },  
        mTipsCheckPercentage: {
            field: 'mTipsCheckPercentage', 
            type: DataTypes.STRING(255), 
            primaryKey: false, 
            allowNull: false ,
            defaultValue:1
        }, 
        status: {
            field: 'status', 
            type: DataTypes.STRING(255), 
            primaryKey: false, 
            allowNull: false ,
            defaultValue:1
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

    return mDefaultCommission;
}