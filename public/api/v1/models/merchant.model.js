const config = require('../config/settings');
const db = config.database;
const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
	const merchant = sequelize.define("merchant", {
        merchantId:{
            field:'merchantId',
            type: DataTypes.UUID,
            primaryKey: true,
            autoIncrement: false,
            defaultValue: DataTypes.UUIDV4
        },
        merchantName: {
             field: 'merchantName', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        }, 
        merchantEmail: {
             field: 'merchantEmail', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false,
        },
        merchantAddress1: {
             field: 'merchantAddress1', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        },
        merchantAddress2: {
             field: 'merchantAddress2', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: true 
        },
        merchantCity: {
             field: 'merchantCity', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        },
        merchantState: {
             field: 'merchantState', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        },
        merchantZipCode: {
             field: 'merchantZipCode', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        },
        merchantTaxId: {
             field: 'merchantTaxId', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        },
        legalName: {
             field: 'legalName', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        },
        merchantPhone: {
             field: 'merchantPhone', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        },
        ownerPhone: {
             field: 'ownerPhone', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        }, 
        ownerName: {
             field: 'ownerName', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        },
        estMonthlySalary: {
             field: 'estMonthlySalary', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        }, 
        merchantSince: {
             field: 'merchantSince', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        },
        merchantCurrentProcessor: {
             field: 'merchantCurrentProcessor', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        },
        syncCode: {
             field: 'syncCode', 
             type: DataTypes.UUID,
             primaryKey: false, 
             allowNull: false,
             defaultValue: DataTypes.UUIDV4
        },
        merchantStatus: {
             field: 'merchantStatus', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        }, 
    }, {
      freezeTableName: true,
      timestamps: false,
      createdAt: false,
      updatedAt: 'updatedDate',
      deletedAt: false
    })

    return merchant;
}      