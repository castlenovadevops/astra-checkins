const config = require('../config/settings');
const db = config.database;
const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
	return sequelize.define("lkup_states", {
        id:{
            field:'id',
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        stateName: {
             field: 'stateName', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        },
        status: {
             field: 'status', 
             type: DataTypes.INTEGER,
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