const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
	return sequelize.define("ticketTips", {
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
           tipsAmount: {
                field: 'tipsAmount', 
                type: DataTypes.STRING(255), 
                primaryKey: false, 
                allowNull: false,
           }, 
           technicianId: {
                field: 'technicianId', 
                type: DataTypes.STRING(255), 
                primaryKey: false, 
                allowNull: false,
           }, 
           tipsCashPercentage: {
                field: 'tipsCashPercentage', 
                type: DataTypes.STRING(255), 
                primaryKey: false, 
                allowNull: false,
           }, 
           tipsCheckPercentage: {
                field: 'tipsCheckPercentage', 
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