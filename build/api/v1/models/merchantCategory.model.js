const config = require('../config/settings');
const db = config.database;
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const mCategory = sequelize.define("mCategory", {
        id:{
            field: 'id', 
            type: DataTypes.UUID, 
            primaryKey: true, 
            allowNull: false,
            defaultValue: DataTypes.UUIDV4
        },
        merchantId: {
            field: 'merchantId', 
            type: DataTypes.STRING(255), 
            primaryKey: false, 
            allowNull: false,
        },
        mCategoryName: {
            field: 'mCategoryName', 
            type: DataTypes.STRING(255), 
            primaryKey: false, 
            allowNull: false 
        },
        mCategoryDescription: {
            field: 'mCategoryDescription', 
            type: DataTypes.STRING(255), 
            primaryKey: false, 
            allowNull: false 
        },
        mCategoryStatus: {
            field: 'mCategoryStatus', 
            type: DataTypes.INTEGER, 
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

    return mCategory;
}