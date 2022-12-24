const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
	return sequelize.define("mPOSDevices", {
        rowId:{
            field:'rowId',
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        merchantId: {
             field: 'merchantId', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        },
        POSId: {
             field: 'POSId', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        },
        deviceDetails: {
             field: 'deviceDetails', 
             type: DataTypes.STRING(1000), 
             primaryKey: false, 
             allowNull: false,
        },
        deviceMAC: {
             field: 'deviceMAC', 
             type: DataTypes.STRING(1000), 
             primaryKey: false, 
             allowNull: true 
        },
        status: {
             field: 'status', 
             type: DataTypes.INTEGER, 
             primaryKey: false, 
             allowNull: false 
        },  
        installedOn: {
             field: 'installedOn', 
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