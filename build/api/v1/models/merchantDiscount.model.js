const config = require('../config/settings');
const db = config.database;
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const mDiscounts = sequelize.define("mDiscounts", {
        id:{
            field:'id',
            type: DataTypes.UUID,
            primaryKey: true,
            autoIncrement: false,
            defaultValue: DataTypes.UUIDV4
        },
        mDiscountId:{
            field:'mDiscountId',
            type: DataTypes.UUID,
            primaryKey: true,
            autoIncrement: false,
            defaultValue: DataTypes.UUIDV4
        },
        mDiscountName: {
            field: 'mDiscountName', 
            type: DataTypes.STRING(255), 
            primaryKey: false, 
            allowNull: false 
        },
        mDiscountType: {
            field: 'mDiscountType', 
            type: DataTypes.STRING(255), 
            primaryKey: false, 
            allowNull: false 
        },
        mDiscountValue: {
            field: 'mDiscountValue', 
            type: DataTypes.STRING(255), 
            primaryKey: false, 
            allowNull: false 
        },
        mDiscountDivisionType: {
            field: 'mDiscountDivisionType', 
            type: DataTypes.STRING(255), 
            primaryKey: false, 
            allowNull: false 
        },
        mOwnerDivision: {
            field: 'mOwnerDivision', 
            type: DataTypes.STRING(255), 
            primaryKey: false, 
            allowNull: false 
        },
        mEmployeeDivision: {
            field: 'mEmployeeDivision', 
            type: DataTypes.STRING(255), 
            primaryKey: false, 
            allowNull: false 
        },
        mDiscountStatus: {
            field: 'mDiscountStatus', 
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
        merchantId: {
            field: 'merchantId', 
            type:  DataTypes.UUID,
            primaryKey: false, 
            allowNull: false,
        },

    },{
        freezeTableName: true,
        timestamps: false,
        createdAt: false,
        updatedAt: 'updatedDate',
        deletedAt: false
    })

    return mDiscounts;
}