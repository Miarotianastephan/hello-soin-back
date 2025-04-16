// src/models/index.js
const { sequelize } = require('../config/database');

// Importation des modèles
const User = require('./user.model');
const UserRole = require('./user-role.model');
const PractitionerInfo = require('./practitioner-info.model');
const Speciality = require('./speciality.model');
const PractSpeciality = require('./pract-speciality.model');

// Associations
User.belongsTo(UserRole, { foreignKey: 'id_user_role', as: 'role' });
User.hasOne(PractitionerInfo, { foreignKey: 'id_user', as: 'practitioner_info' });

PractitionerInfo.belongsTo(User, { foreignKey: 'id_user', as: 'user' });
PractitionerInfo.belongsToMany(Speciality, {
  through: PractSpeciality,
  foreignKey: 'id_pract_info',
  otherKey: 'id_speciality',
  as: 'specialities'
});

Speciality.belongsToMany(PractitionerInfo, {
  through: PractSpeciality,
  foreignKey: 'id_speciality',
  otherKey: 'id_pract_info',
  as: 'practitioners'
});

// Associations directes pour PractSpeciality
Speciality.hasMany(PractSpeciality, { foreignKey: 'id_speciality' });
PractSpeciality.belongsTo(Speciality, { foreignKey: 'id_speciality' });

PractitionerInfo.hasMany(PractSpeciality, { foreignKey: 'id_pract_info' });
PractSpeciality.belongsTo(PractitionerInfo, { foreignKey: 'id_pract_info' });

// Exportation des modèles et de Sequelize
module.exports = {
  sequelize,
  User,
  UserRole,
  PractitionerInfo,
  Speciality,
  PractSpeciality
};
