const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
	return sequelize.define("toBeSynced", {
        rowId:{
            field:'rowId',
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        merchantId: {
             field: 'merchantId', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        },
        syncTable: {
             field: 'syncTable', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        },
        tableRowId: {
             field: 'tableRowId', 
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