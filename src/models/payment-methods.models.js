const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PaymentMethods = sequelize.define('PaymentMethods', {
    id_payment_method: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
 
}, {
  tableName: 'payment_methods',
  timestamps: false
});

module.exports = PaymentMethods;
