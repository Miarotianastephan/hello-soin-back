const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const FormationSupportDoc = sequelize.define('FormationSupportDoc', {
  id_formation_support_doc: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  doc_photo_url: {
    type: DataTypes.STRING(256),
    allowNull: true,
  },
  doc_url: {
    type: DataTypes.STRING(256),
    allowNull: true,
  },
  id_formation: {
    type: DataTypes.INTEGER,
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
  }
}, {
  tableName: 'formation_support_docs',
  timestamps: false,
});

module.exports = FormationSupportDoc;
