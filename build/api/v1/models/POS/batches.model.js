const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
     return sequelize.define("batches", {
        batchId:{
            field:'batchId',
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        batchName: {
             field: 'batchName', 
             type: DataTypes.STRING(255), 
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
             type: DataTypes.STRING(100), 
             primaryKey: false, 
             allowNull: false,
             defaultValue:1,
        },
        createdDate: {
             field: 'createdDate', 
             type: DataTypes.STRING(100), 
             primaryKey: false, 
             allowNull: false,
             defaultValue:1,
        }
    }, {
      freezeTableName: true,
      timestamps: false,
      createdAt: false,
      updatedAt: false,
      deletedAt: false
    })
}      