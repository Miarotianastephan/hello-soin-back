const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Formation = sequelize.define('Formation', {
  id_formation: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  institution_name: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  obtained_at: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  certification_name: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  id_pract_info: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  certification_number: {
    type: DataTypes.STRING(64),
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
  },
  deleted_at: {
    type: DataTypes.DATE,
  },
  validated_at: {
    type: DataTypes.DATE,
  },
  validation_type: {
    type: DataTypes.STRING(11),
    defaultValue: 'Pending',
  },
  validated_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
  }
}, {
  tableName: 'formations',
  timestamps: false,
});

module.exports = Formation;
