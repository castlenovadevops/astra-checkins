const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
	return sequelize.define("ticketservicediscountcommission", {
          id:{
               field:'id',
               type: DataTypes.UUID,
               primaryKey: true,
               defaultValue: DataTypes.UUIDV4
           },
           ticketServiceId:{
               field:'ticketServiceId',
               type: DataTypes.UUID,
               primaryKey: true
           }, 
           technicianId: {
                field: 'technicianId', 
                type: DataTypes.STRING(255), 
                primaryKey: false, 
                allowNull: false,
           }, 
           totalDiscountAmount: {
                field: 'totalDiscountAmount', 
                type: DataTypes.STRING(255), 
                primaryKey: false, 
                allowNull: false,
           },  
           commissionId: {
                field: 'commissionId', 
                type: DataTypes.STRING(255), 
                primaryKey: false, 
                allowNull: false,
           },  
           ownerPercentage: {
                field: 'ownerPercentage', 
                type: DataTypes.STRING(255), 
                primaryKey: false, 
                allowNull: false,
           }, 
           employeePercentage: {
                field: 'employeePercentage', 
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
    }, {
      freezeTableName: true,
      timestamps: false,
      createdAt: false,
      updatedAt: false,
      deletedAt: false
    })
}      