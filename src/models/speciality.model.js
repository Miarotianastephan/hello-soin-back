// models/speciality.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database').sequelize;

const Speciality = sequelize.define('Speciality', {
  id_speciality: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  designation: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(256),
    allowNull: true,     // ← ici on passe à true
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
}, {
  tableName: 'specialities',
  timestamps: false,
});

module.exports = Speciality;
