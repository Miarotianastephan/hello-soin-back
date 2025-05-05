// src/models/index.js
const { sequelize } = require('../config/database');

// Importation des modèles
const User = require('./user.model');
const UserRole = require('./user-role.model');
const PractitionerInfo = require('./practitioner-info.model');
const Speciality = require('./speciality.model');
const PractSpeciality = require('./pract-speciality.model');
const EmailValidationCode = require('./email-validation-code.model');
const Formation = require('./formation.model');
const FormationSupportDoc = require('./formation-support-doc.model');
const FormationSpeciality = require('./formation-speciality.model');
const PractPaymentMethods = require('./parct-payment-methodes.model');
const PractPatientType    = require('./pract-patient-type.model');
const PaymentMethods      = require('./payment-methods.models');
const PatientType         = require('./patient-type.model');
const Solution = require('./solution.model');
const SpecialitySolution = require('./speciality-solution.model');
const Trouble = require('./trouble.model');
const TroubleCategory = require('./trouble-category.model');
const TroubleSolution = require('./trouble-solution.model');
const PractitionerApproach = require('./practitioner-approach.model');

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
PractSpeciality.belongsTo(Speciality, { foreignKey: 'id_speciality', as: 'speciality' });

PractitionerInfo.hasMany(PractSpeciality, { foreignKey: 'id_pract_info' });
PractSpeciality.belongsTo(PractitionerInfo, { foreignKey: 'id_pract_info' });

// Formation <-> PractitionerInfo
Formation.belongsTo(PractitionerInfo, {foreignKey: 'id_pract_info', as: 'practitioner' });
PractitionerInfo.hasMany(Formation, {foreignKey: 'id_pract_info', as: 'formations' });

// FormationSupportDoc <-> Formation
FormationSupportDoc.belongsTo(Formation, {foreignKey: 'id_formation', as: 'formation' });
Formation.hasMany(FormationSupportDoc, {foreignKey: 'id_formation', as: 'support_docs' });

// FormationSpeciality <-> Formation / PractSpeciality / PractitionerInfo
FormationSpeciality.belongsTo(Formation, {foreignKey: 'id_formation', as: 'formation' });
Formation.hasOne(FormationSpeciality, {foreignKey: 'id_formation', as: 'formation_specialities' });

FormationSpeciality.belongsTo(PractSpeciality, {foreignKey: 'id_pract_speciality', as: 'pract_speciality' });

FormationSpeciality.belongsTo(PractitionerInfo, {foreignKey: 'id_pract_info', as: 'practitioner' });

// Un praticien a plusieurs liaisons à des modes de paiement
PractitionerInfo.hasMany(PractPaymentMethods, {foreignKey: 'id_pract_info', as: 'paymentLinks' });
PractPaymentMethods.belongsTo(PractitionerInfo, {foreignKey: 'id_pract_info', as: 'practitioner' });

// Un lien de paiement désigne un mode de paiement
PractPaymentMethods.belongsTo(PaymentMethods, { foreignKey: 'id_payment_method', as: 'method' });
PaymentMethods.hasMany(PractPaymentMethods, { foreignKey: 'id_payment_method', as: 'practitionerLinks' });

// Même principe pour les types de patients
PractitionerInfo.hasMany(PractPatientType, { foreignKey: 'id_pract_info', as: 'patientLinks' });
PractPatientType.belongsTo(PractitionerInfo, { foreignKey: 'id_pract_info', as: 'practitioner' });

PractPatientType.belongsTo(PatientType, {foreignKey: 'id_patient_type',  as: 'type' });
PatientType.hasMany(PractPatientType, {foreignKey: 'id_patient_type', as: 'practitionerLinks' });


Solution.hasMany(SpecialitySolution, {foreignKey: 'id_solution', as: 'specialitySolutions'});

TroubleCategory.hasMany(Trouble, { foreignKey: 'id_trouble_category', as: 'troubles' });
Trouble.belongsTo(TroubleCategory, {foreignKey: 'id_trouble_category', as: 'category'});

TroubleSolution.belongsTo(Trouble, {foreignKey: 'id_trouble', as: 'trouble'});

TroubleSolution.belongsTo(Solution, {foreignKey: 'id_solution', as: 'solution' });

TroubleSolution.belongsTo(Speciality, {foreignKey: 'id_speciality', as: 'speciality' });

PractitionerApproach.belongsTo(PractitionerInfo, { foreignKey: 'id_pract_info', as: 'practitioner' });

PractitionerApproach.belongsTo(Trouble, { foreignKey: 'id_trouble', as: 'trouble'});

PractitionerApproach.belongsTo(Solution, { foreignKey: 'id_solution', as: 'solution'});

PractitionerApproach.belongsTo(PractSpeciality, { foreignKey: 'id_pract_speciality', as: 'practSpeciality'});

// Exportation des modèles et de Sequelize
module.exports = {
  sequelize,
  User,
  UserRole,
  PractitionerInfo,
  Speciality,
  PractSpeciality,
  EmailValidationCode,
  Formation,
  FormationSpeciality,
  FormationSupportDoc,
  PractPaymentMethods,
  PractPatientType,
  PaymentMethods,
  PatientType,
  Solution,
  SpecialitySolution,
  TroubleCategory,
  Trouble,
  TroubleSolution,
  PractitionerApproach
};
