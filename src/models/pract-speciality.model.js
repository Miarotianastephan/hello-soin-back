const { DataTypes } = require('sequelize');
const sequelize = require('../config/database').sequelize;

const PractSpeciality = sequelize.define('PractSpeciality', {
  id_pract_speciality: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_speciality: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  default_fee_value: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  id_pract_info: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  is_main: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'pract_specialities',
  timestamps: false
});

module.exports = PractSpeciality;
