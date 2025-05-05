// services/user.service.js
const db = require('../models');
const User = db.User;
const PractitionerInfo = db.PractitionerInfo;
const PractPaymentMethods = db.PractPaymentMethods;
const PaymentMethods      = db.PaymentMethods;
const PractPatientType    = db.PractPatientType;
const PatientType         = db.PatientType;

/**
 * Complète ou met à jour les informations utilisateur et praticien.
 * Si c'est une première complétion, crée la fiche PractitionerInfo.
 * @param {Object} userData - Données du formulaire.
 * @param {boolean} isCompletion - true si première complétion, false sinon.
 * @returns {Promise<Object>} - Résultat de l'opération.
 */
exports.completeInformation = async (userData, isCompletion) => {
  const {
    id_user,
    firstname,
    lastname,
    mail,
    birthdate,
    situation,
    mobile_number,
    phone_number,
    profil_photo,
    adress,
    postal_code,
    city,
    siret,
    is_office_consult,
    is_visio_consult,
    is_home_consult,
    profil_description,
    facebook_link,
    linkedin_link
  } = userData;

  try {
    // Met à jour l'utilisateur
    const userToUpdate = await User.findByPk(id_user);
    if (!userToUpdate) {
      throw new Error('Utilisateur introuvable.');
    }
    await userToUpdate.update({
      firstname,
      lastname,
      mail,
      birthdate,
      situation,
      mobile_number,
      phone_number,
      profil_photo,
      adress,
      postal_code,
      city,
      updated_at: new Date()
    });

    // Cherche la fiche PractitionerInfo
    let practInfo = await PractitionerInfo.findOne({ where: { id_user } });

    if (!practInfo) {
      // Création initiale
      const createData = {
        id_user,
        siret,
        profil_description: isCompletion ? null : profil_description,
        facebook_link: isCompletion ? null : facebook_link,
        linkedin_link: isCompletion ? null : linkedin_link,
        prat_started_at: new Date(),
        is_office_consult,
        is_visio_consult,
        is_home_consult,
        created_at: new Date(),
        updated_at: new Date()
      };
      practInfo = await PractitionerInfo.create(createData);
    } else {
      // Mise à jour complète avec toutes les colonnes
      const updateData = {
        siret,
        profil_description,
        facebook_link,
        linkedin_link,
        is_office_consult,
        is_visio_consult,
        is_home_consult,
        updated_at: new Date()
      };
      await practInfo.update(updateData);
    }
  
    return { success: true, message: 'Informations utilisateur et praticien enregistrées avec succès.' };
  } catch (error) {
    console.error('Erreur completeInformation :', error);
    throw error;
  }
};

/**
 * Récupère les données utilisateur et praticien par token.
 * @param {number} id_user
 */
exports.getPractitionerInfo = async (id_user) => {
  try {
    const userWithInfo = await User.findOne({
      where: { id_user },
      attributes: [
        'id_user', 'firstname', 'lastname', 'mail', 'phone_number',
        'mobile_number', 'birthdate', 'situation', 'profil_photo',
        'adress', 'postal_code', 'city', 'is_validated', 'created_at', 'updated_at'
      ],
      include: [{
        model: PractitionerInfo,
        as: 'practitioner_info',
        attributes: [
          'id_pract_info', 'profil_description', 'hook', 'siret',
          'facebook_link', 'linkedin_link', 'prat_started_at',
          'is_office_consult', 'is_visio_consult', 'is_home_consult',
          'created_at', 'updated_at', 'experiences_years', 'experiences_date'
        ]
      }]
    });
    if (!userWithInfo) throw new Error('Praticien introuvable.');
    return userWithInfo;
  } catch (error) {
    console.error('Erreur getPractitionerInfo :', error);
    throw error;
  }
};

exports.checkExistEmail = async (emailToVerify) => {
  try {
      const user = await User.findOne({
          where: { mail: emailToVerify }
      });
      if(user){
          throw new Error("Adresse email déjà utilisé !");
      }
  } catch (error) {
      console.log("Erreur de vérification du mail: ", error.message);
      throw error;
  }
}

exports.saveUser = async (userData) => {
  try {
      const result = await User.create(userData);
      return result;
  } catch (error) {
      throw error;
  }
}

// services/user.service.js
// … au-dessus, vos autres exports …

const calculateExperienceYears = (startDate) => {
  if (!startDate) return 0;
  const start = new Date(startDate);
  const today = new Date();
  
  if (start > today) return 0;

  let years = today.getFullYear() - start.getFullYear();
  const monthDiff = today.getMonth() - start.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < start.getDate())) {
    years--;
  }
  
  return years < 0 ? 0 : years;
};

// Modification des fonctions existantes
exports.addExperienceYears = async (id_user, start_date) => {
  const practInfo = await PractitionerInfo.findOne({ where: { id_user } });
  if (!practInfo) throw new Error('Fiche praticien introuvable.');

  practInfo.experiences_date = start_date;
  practInfo.experiences_years = calculateExperienceYears(start_date);
  await practInfo.save();
  return practInfo;
};

exports.updateExperienceYears = async (id_user, start_date) => {
  const practInfo = await PractitionerInfo.findOne({ where: { id_user } });
  if (!practInfo) throw new Error('Fiche praticien introuvable.');

  practInfo.experiences_date = start_date;
  practInfo.experiences_years = calculateExperienceYears(start_date);
  await practInfo.save();
  return practInfo;
};

// Version corrigée de getExperienceYears (supprimer la duplication)
exports.getExperienceYears = async (id_user) => {
  const practInfo = await PractitionerInfo.findOne({
    where: { id_user },
    attributes: ['experiences_years', 'experiences_date']
  });
  
  if (!practInfo) throw new Error('Fiche praticien introuvable.');
  
  return {
    experiences_years: practInfo.experiences_years,
    start_date: practInfo.experiences_date?.split('T')[0].slice(0,7)
  };
};

/**
 * Récupère les modes de paiement d’un praticien via hasMany/belongsTo.
 */
exports.getPaymentMethodsByPractitioner = async (id_user) => {
  const practInfo = await PractitionerInfo.findOne({
    where: { id_user },
    include: [{
      model: PractPaymentMethods,
      as: 'paymentLinks',
      include: [{
        model: PaymentMethods,
        as: 'method'
      }]
    }]
  });
  if (!practInfo) throw new Error('Fiche praticien introuvable.');
  // on ne renvoie que les objets PaymentMethods
  return practInfo.paymentLinks.map(link => link.method);
};

/**
 * Remplace entièrement la liste des modes de paiement.
 */
exports.setPaymentMethodsForPractitioner = async (id_user, paymentMethodIds) => {
  const practInfo = await PractitionerInfo.findOne({ where: { id_user } });
  if (!practInfo) throw new Error('Fiche praticien introuvable.');

  // Supprime tout d’abord
  await PractPaymentMethods.destroy({ where: { id_pract_info: practInfo.id_pract_info } });
  // Puis recrée
  const bulk = paymentMethodIds.map(id_pm => ({
    id_pract_info: practInfo.id_pract_info,
    id_payment_method: id_pm
  }));
  if (bulk.length) await PractPaymentMethods.bulkCreate(bulk);
};

/**
 * Supprime un seul mode de paiement.
 */
exports.removePaymentMethodFromPractitioner = async (id_user, paymentMethodId) => {
  const practInfo = await PractitionerInfo.findOne({ where: { id_user } });
  if (!practInfo) throw new Error('Fiche praticien introuvable.');

  await PractPaymentMethods.destroy({
    where: {
      id_pract_info: practInfo.id_pract_info,
      id_payment_method: paymentMethodId
    }
  });
};

/**
 * Récupère les types de patients d’un praticien.
 */
exports.getPatientTypesByPractitioner = async (id_user) => {
  const practInfo = await PractitionerInfo.findOne({
    where: { id_user },
    include: [{
      model: PractPatientType,
      as: 'patientLinks',
      include: [{
        model: PatientType,
        as: 'type'
      }]
    }]
  });
  if (!practInfo) throw new Error('Fiche praticien introuvable.');
  return practInfo.patientLinks.map(link => link.type);
};

/**
 * Remplace la liste des types de patients.
 */
exports.setPatientTypesForPractitioner = async (id_user, patientTypeIds) => {
  const practInfo = await PractitionerInfo.findOne({ where: { id_user } });
  if (!practInfo) throw new Error('Fiche praticien introuvable.');

  await PractPatientType.destroy({ where: { id_pract_info: practInfo.id_pract_info } });
  const bulk = patientTypeIds.map(id_pt => ({
    id_pract_info: practInfo.id_pract_info,
    id_patient_type: id_pt
  }));
  if (bulk.length) await PractPatientType.bulkCreate(bulk);
};

/**
 * Supprime un type de patient.
 */
exports.removePatientTypeFromPractitioner = async (id_user, patientTypeId) => {
  const practInfo = await PractitionerInfo.findOne({ where: { id_user } });
  if (!practInfo) throw new Error('Fiche praticien introuvable.');

  await PractPatientType.destroy({
    where: {
      id_pract_info: practInfo.id_pract_info,
      id_patient_type: patientTypeId
    }
  });
};

/**
 * Récupère tous les modes de paiement disponibles.
 * @returns {Promise<Array<PaymentMethods>>}
 */
exports.getAllPaymentMethods = async () => {
  try {
    return await PaymentMethods.findAll();
  } catch (error) {
    console.error('Erreur getAllPaymentMethods :', error);
    throw error;
  }
};

/**
 * Récupère tous les types de patients disponibles.
 * @returns {Promise<Array<PatientType>>}
 */
exports.getAllPatientTypes = async () => {
  try {
    return await PatientType.findAll();
  } catch (error) {
    console.error('Erreur getAllPatientTypes :', error);
    throw error;
  }
};

