const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
     return sequelize.define("printers", {
        id:{
            field:'id',
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        printerName: {
             field: 'printerName', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        },
        printerIdentifier: {
             field: 'printerIdentifier', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        },
        BillPrint: {
             field: 'BillPrint', 
             type: DataTypes.INTEGER, 
             primaryKey: false, 
             allowNull: false,
             defaultValue:1,
        },
        ReportPrint: {
             field: 'ReportPrint', 
             type: DataTypes.INTEGER, 
             primaryKey: false, 
             allowNull: false,
             defaultValue:1,
        },
        headerText: {
             field: 'headerText', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false,
        },
        footerText: {
             field: 'footerText', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false,
        },
        Title: {
             field: 'Title', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false,
        },
        fontFamily: {
             field: 'fontFamily', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false,
        },
        fontSize: {
             field: 'fontSize', 
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