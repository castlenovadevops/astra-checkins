const config = require('../config/settings');
const db = config.database;
const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
	return sequelize.define("customerLoyaltyPoints", {
        id:{
            field:'id',
            type: DataTypes.UUID,
            primaryKey: true,
            autoIncrement: false,
            defaultValue:DataTypes.UUIDV4
        }, 
        customerId:{
          field:'customerId',
          type: DataTypes.UUID,
          primaryKey: false,
          autoIncrement: false
          },
          ticketValue: {
               field: 'ticketValue', 
               type: DataTypes.STRING(255), 
               primaryKey: false, 
               allowNull: false,
               defaultValue:1
          }, 
        pointsCount: {
             field: 'pointsCount', 
             type: DataTypes.INTEGER, 
             primaryKey: false, 
             allowNull: false,
             defaultValue:1
        }, 
        dollarValue: {
             field: 'dollarValue', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        }, 
        status: {
             field: 'status', 
             type: DataTypes.INTEGER, 
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