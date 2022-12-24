const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
     const appointments =  sequelize.define("appointments", {
        id:{
            field:'id',
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        appointmentId: {
             field: 'appointmentId', 
             type: DataTypes.UUID,
             primaryKey: false, 
             allowNull: false,
             defaultValue: DataTypes.UUIDV4
        },
        merchantId: {
             field: 'merchantId', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: true 
        },
        customerId: {
             field: 'customerId', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: true, 
        },
        guestName: {
             field: 'guestName', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: true, 
        },
        guestMobile: {
             field: 'guestMobile', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: true, 
        },
        appointmentDate: {
             field: 'appointmentDate', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: true, 
        },
        appointmentTime: {
             field: 'appointmentTime', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: true, 
        },
        parentId: {
             field: 'parentId', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: true, 
        },
        ticketId: {
             field: 'ticketId', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: true, 
        },
        appointmentBookedBy: {
             field: 'appointmentBookedBy', 
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
        appointmentStatus: {
             field: 'appointmentStatus', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: true, 
        }, 
        recordType: {
             field: 'recordType', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: true, 
             defaultValue:'Appointment'
        }, 
    }, {
      freezeTableName: true,
      timestamps: false,
      createdAt: false,
      updatedAt: false,
      deletedAt: false
    })

    appointments.associate = (models)=>{

    models.appointments.hasMany(models.appointmentServices, {foreignKey: 'appointmentId',sourceKey: 'appointmentId'});
    models.appointmentServices.belongsTo(models.appointments, {foreignKey: 'appointmentId', targetKey: 'appointmentId'});
    
    models.mProducts.hasMany(models.appointmentServices,  {foreignKey: 'serviceId', targetKey: 'mProductId'});
    models.appointmentServices.belongsTo(models.mProducts,  {foreignKey: 'serviceId', targetKey: 'mProductId'});
   
    }

    return appointments;
}      