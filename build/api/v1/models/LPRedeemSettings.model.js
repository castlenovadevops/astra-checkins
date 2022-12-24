const config = require('../config/settings');
const db = config.database;
const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
	return sequelize.define("LPRedeemSettings", {
        id:{
            field:'id',
            type: DataTypes.UUID,
            primaryKey: true,
            autoIncrement: false,
            defaultValue:DataTypes.UUIDV4
        },
        merchantId:{
          field:'merchantId',
          type: DataTypes.UUID, 
          primaryKey: false, 
          allowNull: true 
      },
        minimumTicketValue: {
             field: 'minimumTicketValue', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        }, 
        dollarSpent: {
             field: 'dollarSpent', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        },
        pointsCount: {
             field: 'pointsCount', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        },
        settingType: {
             field: 'settingType', 
             type: DataTypes.STRING(200), 
             primaryKey: false, 
             allowNull: false,
             defaultValue:'General'
        },
        status: {
             field: 'status', 
             type: DataTypes.INTEGER, 
             primaryKey: false, 
             allowNull: false,
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
        }
    }, {
      freezeTableName: true,
      timestamps: false,
      createdAt: false,
      updatedAt: false,
      deletedAt: false
    })
}      