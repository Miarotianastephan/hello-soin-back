const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PractPaymentMethods = sequelize.define('PractPaymentMethods', {
  id_pract_payment_method: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_pract_info: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  id_payment_method: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'practitioner_payment_methods',
  timestamps: true,            // gère createdAt & updatedAt
  createdAt: 'created_at',     // mappe createdAt → created_at
  updatedAt: 'updated_at',     // mappe updatedAt → updated_at
  paranoid: true,              // active deletedAt (soft delete)
  deletedAt: 'deleted_at',     // mappe deletedAt → deleted_at
  underscored: true,           // force snake_case pour tous les champs auto
});

module.exports = PractPaymentMethods;
