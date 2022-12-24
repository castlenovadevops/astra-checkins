const config = require('../config/settings');
const db = config.database;
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const mDefaultDiscountDivision = sequelize.define("mDefaultDiscountDivision", {
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

    return mDefaultDiscountDivision;
}