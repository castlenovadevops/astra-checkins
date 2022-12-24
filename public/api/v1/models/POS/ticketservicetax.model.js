const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
	return sequelize.define("ticketservicetax", {
        id:{
            field:'id',
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        ticketServiceId:{
            field:'ticketServiceId',
            type: DataTypes.UUID,
            primaryKey: false
        }, 
        mTaxId: {
          field: 'mTaxId', 
          type: DataTypes.STRING(255), 
          primaryKey: false, 
          allowNull: false,
     }, 
     mTaxName: {
          field: 'mTaxName', 
          type: DataTypes.STRING(255), 
          primaryKey: false, 
          allowNull: false,
     }, 
     mTaxAmount: {
          field: 'mTaxAmount', 
          type: DataTypes.STRING(255), 
          primaryKey: false, 
          allowNull: false,
     }, 
     mTaxType: {
          field: 'mTaxType', 
          type: DataTypes.STRING(255), 
          primaryKey: false, 
          allowNull: false,
     }, 
     mTaxValue: {
          field: 'mTaxValue', 
          type: DataTypes.STRING(255), 
          primaryKey: false, 
          allowNull: false,
     }, 

     status: {
          field: 'status', 
          type: DataTypes.INTEGER, 
          primaryKey: false, 
          allowNull: false,
          defaultValue:1
     }, 
        createdDate: {
             field: 'createdDate', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false,
        },
        createdBy: {
             field: 'createdBy', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false,
        }
    }, {
      freezeTableName: true,
      timestamps: false,
      createdAt: false,
      updatedAt: false,
      deletedAt: false
    })
}      