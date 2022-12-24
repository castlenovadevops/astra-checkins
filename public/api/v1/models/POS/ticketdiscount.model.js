const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
	return sequelize.define("ticketdiscount", {
          id:{
               field:'id',
               type: DataTypes.UUID,
               primaryKey: true,
               defaultValue: DataTypes.UUIDV4
           },
           ticketId:{
               field:'ticketId',
               type: DataTypes.UUID,
               primaryKey: true
           }, 
           mDiscountAmount: {
                field: 'mDiscountAmount', 
                type: DataTypes.STRING(255), 
                primaryKey: false, 
                allowNull: false,
           }, 
           mDiscountId: {
                field: 'mDiscountId', 
                type: DataTypes.STRING(255), 
                primaryKey: false, 
                allowNull: false,
           }, 
           mDiscountValue: {
                field: 'mDiscountValue', 
                type: DataTypes.STRING(255), 
                primaryKey: false, 
                allowNull: false,
           }, 
           mDiscountType: {
                field: 'mDiscountType', 
                type: DataTypes.STRING(255), 
                primaryKey: false, 
                allowNull: false,
           }, 
           mDiscountDivisionType: {
                field: 'mDiscountDivisionType', 
                type: DataTypes.STRING(255), 
                primaryKey: false, 
                allowNull: false,
           },
           mOwnerDivision: {
                field: 'mOwnerDivision', 
                type: DataTypes.STRING(255), 
                primaryKey: false, 
                allowNull: false,
           }, 
           mEmployeeDivision: {
                field: 'mEmployeeDivision', 
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