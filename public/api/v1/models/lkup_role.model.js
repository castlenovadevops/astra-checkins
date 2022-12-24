const config = require('../config/settings');
const db = config.database;
const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
	return sequelize.define("lkup_role", {
        roleId:{
            field:'roleId',
            type: DataTypes.UUID,
            primaryKey: true,
            autoIncrement: false,
            defaultValue:DataTypes.UUIDV4
        },
        roleName: {
             field: 'roleName', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        },
        roleType: {
             field: 'roleType', 
             type: DataTypes.STRING(255),
             primaryKey: false, 
             allowNull: false 
        },
        roleStatus: {
             field: 'roleStatus', 
             type: DataTypes.INTEGER,
             primaryKey: false, 
             allowNull: false 
        },
        merchantId: {
             field: 'merchantId', 
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
    }, {
      freezeTableName: true,
      timestamps: false,
      createdAt: false,
      updatedAt: false,
      deletedAt: false
    })
}      