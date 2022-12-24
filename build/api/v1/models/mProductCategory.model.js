const config = require('../config/settings');
const db = config.database;
const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
	const mProductCategory = sequelize.define("mProductCategory", {
        id:{
            field:'id',
            type: DataTypes.UUID,
            primaryKey: true,
            autoIncrement: false,
            defaultValue: DataTypes.UUIDV4
        },
        mProductId:{
            field:'mProductId',
            type: DataTypes.UUID,
            primaryKey: true,
            autoIncrement: false,
            defaultValue: DataTypes.UUIDV4
        },
        mCategoryId: {
          field: 'mCategoryId', 
          type:  DataTypes.UUID,
          primaryKey: false, 
          allowNull: false,
          }, 
        status: {
             field: 'status', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        }, 
        
        createdBy: {
             field: 'createdBy', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        },
        createdDate: {
             field: 'createdDate', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        },
        updatedBy: {
             field: 'updatedBy', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: true 
        },
        updatedDate: {
             field: 'updatedDate', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: true 
        },
    }, {
      freezeTableName: true,
      timestamps: false,
      createdAt: false,
      updatedAt: 'updatedDate',
      deletedAt: false
    })

    mProductCategory.associate = function(models){
     models.mProducts.hasMany(models.mProductCategory, {foreignKey: 'mProductId',sourceKey: 'mProductId'});
    models.mProductCategory.belongsTo(models.mProducts,  {foreignKey: 'mProductId', targetKey: 'mProductId'});
    
    }

    return mProductCategory;
}      