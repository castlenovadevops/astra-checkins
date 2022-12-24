const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
	const tickets = sequelize.define("tickets", {
        ticketId:{
            field:'ticketId',
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        merchantId: {
             field: 'merchantId', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        },
        batchId: {
             field: 'batchId', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: true,
             defaultValue:''
        },
        ticketCode: {
             field: 'ticketCode', 
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
        ownerTechnician: {
             field: 'ownerTechnician', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: true,
        },
        customerId: {
             field: 'customerId', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: true,
        },
        taxApplied: {
             field: 'taxApplied', 
             type: DataTypes.INTEGER, 
             primaryKey: false, 
             allowNull: true,
             defaultValue:0
        },
        serviceDiscountApplied: {
             field: 'serviceDiscountApplied', 
             type: DataTypes.INTEGER, 
             primaryKey: false, 
             allowNull: true,
             defaultValue:0
        },
        ticketDiscountApplied: {
             field: 'ticketDiscountApplied', 
             type: DataTypes.INTEGER, 
             primaryKey: false, 
             allowNull: true,
             defaultValue:0
        },
        tipsAmount: {
             field: 'tipsAmount', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: true,
        },
        taxAmount: {
             field: 'taxAmount', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: true,
        },
        serviceAmount: {
             field: 'serviceAmount', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: true,
        },
        ticketTotalAmount: {
             field: 'ticketTotalAmount', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: true,
        },
        ticketNotes: {
             field: 'ticketNotes', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: true,
        },
        ticketStatus: {
             field: 'ticketStatus', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: true,
             defaultValue:'Active'
        },
        ticketType: {
             field: 'ticketType', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: true,
             defaultValue:'New'
        },
        tipsType: {
             field: 'tipsType', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: true,
        },
        paymentStatus: {
             field: 'paymentStatus', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: true,
        },
        isDraft: {
             field: 'isDraft', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: true,
        },
        createdDate: {
             field: 'createdDate', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: true,
        },
        createdBy: {
             field: 'createdBy', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: true,
        }
    }, {
      freezeTableName: true,
      timestamps: false,
      createdAt: false,
      updatedAt: false,
      deletedAt: false
    })
    tickets.associate = function(models){
          models.mCustomers.hasMany(models.tickets, {foreignKey: 'customerId',sourceKey: 'mCustomerId'});
     models.tickets.belongsTo(models.mCustomers, {foreignKey: 'customerId',targetKey: 'mCustomerId'});

     models.tickets.hasMany(models.ticketservices, {foreignKey: 'ticketId',sourceKey: 'ticketId'});
     models.ticketservices.belongsTo(models.tickets, {foreignKey: 'ticketId',targetKey: 'ticketId'});

     models.merchantEmployees.hasMany(models.tickets, {foreignKey: 'ownerTechnician',sourceKey: 'mEmployeeId'});
     models.tickets.belongsTo(models.merchantEmployees, {foreignKey: 'ownerTechnician',targetKey: 'mEmployeeId'}); 

     models.tickets.hasMany(models.ticketpayment, {foreignKey: 'ticketId',sourceKey: 'ticketId'});
     models.ticketpayment.belongsTo(models.tickets, {foreignKey: 'ticketId',targetKey: 'ticketId'});

     models.tickets.hasMany(models.ticketdiscount, {foreignKey: 'ticketId',sourceKey: 'ticketId'});
     models.ticketdiscount.belongsTo(models.tickets, {foreignKey: 'ticketId',targetKey: 'ticketId'});

    }
    return tickets;
}      