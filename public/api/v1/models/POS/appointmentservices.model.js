const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
     return sequelize.define("appointmentServices", {
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
        serviceId: {
             field: 'serviceId', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: true 
        },
        technicianId: {
             field: 'technicianId', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: true, 
        },
        serviceDuration: {
             field: 'serviceDuration', 
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
}      