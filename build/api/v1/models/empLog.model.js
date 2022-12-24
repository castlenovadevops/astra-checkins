const config = require('../config/settings');
const db = config.database;
const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
	return sequelize.define("empLog", {  
          id: {
               field: 'id', 
               type: DataTypes.UUID, 
               primaryKey: true, 
               allowNull: false,
               defaultValue:DataTypes.UUIDV4
          },
        mEmployeeId: {
             field: 'mEmployeeId', 
             type: DataTypes.UUID, 
             primaryKey: false, 
             allowNull: false 
        },
        clockedInOn: {
             field: 'clockedInOn', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: true 
        },
        clockedOutOn: {
             field: 'clockedOutOn', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: true,
        },  
        status: {
             field: 'status', 
             type: DataTypes.INTEGER, 
             primaryKey: false, 
             allowNull: false ,
             defaultValue:1
        },  
    }, {
      freezeTableName: true,
      timestamps: false,
      createdAt: false,
      updatedAt: false,
      deletedAt: false
    })
}      