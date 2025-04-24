const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const FormationSpeciality = sequelize.define('FormationSpeciality', {
  id_formation_specialite: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_formation: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  id_pract_speciality: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_pract_info: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
  }
}, {
  tableName: 'formation_specialities',
  timestamps: false,
});

module.exports = FormationSpeciality;
