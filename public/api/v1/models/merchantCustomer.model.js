const config = require('../config/settings');
const db = config.database;
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const mCustomers = sequelize.define("mCustomers", {
        mCustomerId:{
            field:'mCustomerId',
            type: DataTypes.UUID,
            primaryKey: true,
            autoIncrement: false,
            defaultValue: DataTypes.UUIDV4
        },
        mCustomerMemberId:{
            field:'mCustomerMemberId',
            type: DataTypes.STRING(255), 
            primaryKey: false, 
            allowNull: false 
        },
        mCustomerName: {
            field: 'mCustomerName', 
            type: DataTypes.STRING(255), 
            primaryKey: false, 
            allowNull: false 
        },
        mCustomerEmail: {
            field: 'mCustomerEmail', 
            type: DataTypes.STRING(255), 
            primaryKey: false, 
            allowNull: false,
        },
        mCustomerMobile: {
            field: 'mCustomerMobile', 
            type: DataTypes.STRING(255), 
            primaryKey: false, 
            allowNull: false,
        },
        mCustomerAddress1: {
            field: 'mCustomerAddress1', 
            type: DataTypes.STRING(255), 
            primaryKey: false, 
            allowNull: false,
        },
        mCustomerAddress2: {
            field: 'mCustomerAddress2', 
            type: DataTypes.STRING(255), 
            primaryKey: false, 
            allowNull: false,
        },
        mCustomerCity: {
            field: 'mCustomerCity', 
            type: DataTypes.STRING(255), 
            primaryKey: false, 
            allowNull: false,
        },
        mCustomerState: {
            field: 'mCustomerState', 
            type: DataTypes.STRING(255), 
            primaryKey: false, 
            allowNull: false,
        },
        mCustomerZipcode: {
            field: 'mCustomerZipcode', 
            type: DataTypes.STRING(255), 
            primaryKey: false, 
            allowNull: false,
        },
        mCustomerDOB: {
            field: 'mCustomerDOB', 
            type: DataTypes.STRING(255), 
            primaryKey: false, 
            allowNull: false,
        },
        mCustomerLoyaltyPoints: {
            field: 'mCustomerLoyaltyPoints', 
            type: DataTypes.STRING(255), 
            primaryKey: false, 
            allowNull: false,
        },
        merchantId: {
            field: 'merchantId', 
            type: DataTypes.STRING(255), 
            primaryKey: false, 
            allowNull: false,
        },
        mCustomerStatus: {
            field: 'mCustomerStatus', 
            type: DataTypes.TEXT, 
            primaryKey: false, 
            allowNull: false,
        },
        mCustomerTotalVisit: {
            field: 'mCustomerTotalVisit', 
            type: DataTypes.STRING(255), 
            primaryKey: false, 
            allowNull: false,
        },
        mCustomerTotalSpent: {
            field: 'mCustomerTotalSpent', 
            type: DataTypes.STRING(255), 
            primaryKey: false, 
            allowNull: false,
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


    },{
        freezeTableName: true,
        timestamps: false,
        createdAt: false,
        updatedAt: 'updatedDate',
        deletedAt: false
    })
    return mCustomers;
}