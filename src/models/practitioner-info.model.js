const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./user.model');
const Speciality = require('./speciality.model');
const PractSpeciality = require('./pract-speciality.model');

const PractitionerInfo = sequelize.define('PractitionerInfo', {
  id_pract_info: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  profil_description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  hook: {
    type: DataTypes.STRING(256),
    allowNull: true
  },
  siret: {
    type: DataTypes.STRING(64),
    allowNull: true
  },
  facebook_link: {
    type: DataTypes.STRING(256),
    allowNull: true
  },
  linkedin_link: {
    type: DataTypes.STRING(256),
    allowNull: true
  },
  prat_started_at: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  id_user: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  is_office_consult: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  is_visio_consult: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  is_home_consult: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'practitioner_info',
  timestamps: false
});

PractitionerInfo.belongsTo(User, {
    foreignKey: 'id_user',
    as: 'user'
});

PractitionerInfo.belongsToMany(Speciality, {
    through: PractSpeciality,
    foreignKey: 'id_pract_info',
    otherKey: 'id_speciality',
    as: 'specialities'
});

module.exports = PractitionerInfo;
