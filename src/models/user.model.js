const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const UserRole = require('./user-role.model');
const PractitionerInfo = require('./practitioner-info.model');

const User = sequelize.define('User', {
  id_user: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firstname: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  lastname: {
    type: DataTypes.STRING(128),
    allowNull: true,
  },
  mail: {
    type: DataTypes.STRING(128),
    allowNull: false,
    unique: true,
  },
  phone_number: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  mobile_number: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  birthdate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  situation: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  profil_photo: {
    type: DataTypes.STRING(256),
    allowNull: true,
  },
  adress: {
    type: DataTypes.STRING(256),
    allowNull: true,
  },
  postal_code: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING(128),
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  is_validated: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  id_user_role: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'user_roles',
      key: 'id_user_role',
    },
  },
}, {
  tableName: 'users',
  timestamps: false,
});

// Déclaration de la relation
User.belongsTo(UserRole, { //MANYTOONE
  foreignKey: 'id_user_role',
  as: 'role',
});

User.hasOne(PractitionerInfo, { //ONETOONE
  foreignKey: 'id_user',
  as: 'practitioner_info'
});

module.exports = User;
