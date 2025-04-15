// src/models/practSpeciality.model.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database').sequelize;
const Speciality = require('./speciality.model');
const PractitionerInfo = require('./practitioner-info.model');

const PractSpeciality = sequelize.define('PractSpeciality', {
  id_pract_speciality: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
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
    allowNull: true
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'pract_specialities',
  timestamps: false
});

// Relations
Speciality.hasMany(PractSpeciality, { foreignKey: 'id_speciality' });
PractSpeciality.belongsTo(Speciality, { foreignKey: 'id_speciality' });

PractitionerInfo.hasMany(PractSpeciality, { foreignKey: 'id_pract_info' });
PractSpeciality.belongsTo(PractitionerInfo, { foreignKey: 'id_pract_info' });


module.exports = PractSpeciality;
