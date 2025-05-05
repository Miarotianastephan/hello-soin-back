const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PatientType = sequelize.define('PatientType', {
  id_patient_type: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
 
}, {
  tableName: 'patient_types',
  timestamps: false
});

module.exports = PatientType;
