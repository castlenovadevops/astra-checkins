const config = require('../config/settings');
const db = config.database;
const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
	const merchantEmployees = sequelize.define("merchantEmployees", {
        mEmployeeId:{
            field:'mEmployeeId',
            type: DataTypes.UUID,
            primaryKey: true,
            autoIncrement: false,
            defaultValue: DataTypes.UUIDV4
        },
        mEmployeeFirstName: {
             field: 'mEmployeeFirstName', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        },
        mEmployeeLastName: {
             field: 'mEmployeeLastName', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        },
        mEmployeeEmail: {
             field: 'mEmployeeEmail', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false,
        },
        mEmployeePassword: {
             field: 'mEmployeePassword', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: true 
        },
        mEmployeeAddress1: {
             field: 'mEmployeeAddress1', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        },
        mEmployeeAddress2: {
             field: 'mEmployeeAddress2', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: true 
        },
        mEmployeeCity: {
             field: 'mEmployeeCity', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        },
        mEmployeeState: {
             field: 'mEmployeeState', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        },
        mEmployeeZipcode: {
             field: 'mEmployeeZipcode', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: true 
        },
        mEmployeePhone: {
             field: 'mEmployeePhone', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: true 
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
        mEmployeeRole: {
             field: 'mEmployeeRole', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false,
        },
        mEmployeeRoleName: {
             field: 'mEmployeeRoleName', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false,
        },
        mEmployeeStatus: {
             field: 'mEmployeeStatus', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false,
        },
        mEmployeePasscode: {
             field: 'mEmployeePasscode', 
             type: DataTypes.STRING(20), 
             primaryKey: false, 
             allowNull: false,
        }
    }, {
      freezeTableName: true,
      timestamps: false,
      createdAt: false,
      updatedAt: 'updatedDate',
      deletedAt: false
    })

    return merchantEmployees;
}      