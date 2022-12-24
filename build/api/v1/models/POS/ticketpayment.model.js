const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
	return sequelize.define("ticketpayment", {
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
           transactionId: {
                field: 'transactionId', 
                type: DataTypes.STRING(255), 
                primaryKey: false, 
                allowNull: false 
           }, 
           customerPaid: {
                field: 'customerPaid', 
                type: DataTypes.STRING(255), 
                primaryKey: false, 
                allowNull: false,
           }, 
           returnedAmount: {
                field: 'returnedAmount', 
                type: DataTypes.STRING(255), 
                primaryKey: false, 
                allowNull: false,
           }, 
           ticketPayment: {
                field: 'ticketPayment', 
                type: DataTypes.STRING(255), 
                primaryKey: false, 
                allowNull: false,
           }, 
           payMode: {
                field: 'payMode', 
                type: DataTypes.STRING(255), 
                primaryKey: false, 
                allowNull: false,
           },
           cardType: {
                field: 'cardType', 
                type: DataTypes.STRING(255), 
                primaryKey: false, 
                allowNull: false,
           }, 
           paymentType: {
                field: 'paymentType', 
                type: DataTypes.STRING(255), 
                primaryKey: false, 
                allowNull: false,
             //    defaultValue:'Full/Partial'
           },  
           paymentFor: {
                field: 'paymentFor', 
                type: DataTypes.STRING(255), 
                primaryKey: false, 
                allowNull: false,
                defaultValue:'ticket'
           },       
           paymentNotes: {
                  field: 'paymentNotes', 
                  type: DataTypes.STRING(255), 
                  primaryKey: false, 
                  allowNull: false,
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