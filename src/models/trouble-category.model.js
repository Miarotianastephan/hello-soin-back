const { DataTypes } = require('sequelize');
const sequelize = require('../config/database').sequelize;

const TroubleCategory = sequelize.define('TroubleCategory', {
    id_trouble_category: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    designation: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: true
    }
  }, {
    tableName: 'trouble_categories',
    timestamps: false
});

module.exports = TroubleCategory;