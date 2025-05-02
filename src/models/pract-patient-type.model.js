const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PractPatientType = sequelize.define('PractPatientType', {
  id_pract_patient_type: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_pract_info: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  id_patient_type: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
 
}, {
  tableName: 'practitioner_patient_types',
  timestamps: true,              // active createdAt et updatedAt
  createdAt: 'created_at',       // renommage de createdAt
  updatedAt: 'updated_at',       // renommage de updatedAt
  paranoid: true,                // active deletedAt pour soft delete
  deletedAt: 'deleted_at',
});

module.exports = PractPatientType;
