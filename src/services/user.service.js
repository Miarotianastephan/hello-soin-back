// services/user.service.js
const db = require('../models');
const User = db.User;
const PractitionerInfo = db.PractitionerInfo;

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
      // Création lors de la première complétion
      const createData = {
        id_user,
        siret,
        profil_description: isCompletion ? null : profil_description,
        facebook_link: isCompletion ? null : facebook_link,
        linkedin_link: isCompletion ? null : linkedin_link,
        prat_started_at: isCompletion ? new Date() : null,
        is_office_consult,
        is_visio_consult,
        is_home_consult,
        created_at: new Date(),
        updated_at: new Date()
      };
      practInfo = await PractitionerInfo.create(createData);
    } else {
      // Mise à jour
      const updateData = isCompletion
        ? { siret, is_office_consult, is_visio_consult, is_home_consult, updated_at: new Date() }
        : { profil_description, facebook_link, linkedin_link, siret, is_office_consult, is_visio_consult, is_home_consult, updated_at: new Date() };
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
          'created_at', 'updated_at'
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
