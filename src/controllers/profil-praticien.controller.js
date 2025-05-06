const UserService = require('../services/user.service');
const FormationService = require('../services/formation.service');

/**
 * POST /complete-profil
 * Crée ou met à jour le profil du praticien.
 */
exports.completeProfil = async (req, res) => {
  try {
    const { body } = req;
    const userId = req.user.id_user;

    // Validation de la photo
    if (req.fileValidationError) {
      return res.status(400).json({
        success: false,
        message: req.fileValidationError,
      });
    }

    // Parsing de isCompletion
    const isCompletion = (body.isCompletion === 'true' || body.isCompletion === true);
    if (isCompletion !== true && isCompletion !== false) {
      return res.status(400).json({ message: "Indiquez si c'est une complétion (true) ou une modification (false)." });
    }

    // Récupération des données existantes en cas de modification
    let existingData = {};
    if (!isCompletion) {
      existingData = await UserService.getPractitionerInfo(userId) || {};
    }

    // Détermination de la photo de profil
    const profilPhoto = req.file
      ? `/uploads/profil-photos/${req.file.filename}`
      : (existingData.profil_photo || null);

    // Construction des données utilisateur
    const userData = {
      id_user: userId,
      firstname: body.firstname,
      lastname: body.lastname,
      mail: body.mail,
      birthdate: body.birthdate,
      situation: body.situation,
      mobile_number: body.mobile_number,
      phone_number: body.phone_number,
      adress: body.adress,
      postal_code: body.postal_code,
      city: body.city,
      profil_photo: profilPhoto,
      siret: body.siret,
      is_office_consult: body.is_office_consult === 'true',
      is_visio_consult: body.is_visio_consult === 'true',
      is_home_consult: body.is_home_consult === 'true',
      profil_description: body.profil_description,
      facebook_link: body.facebook_link,
      linkedin_link: body.linkedin_link,
      isCompletion,
    };

    // Appel au service pour compléter ou mettre à jour
    const result = await UserService.completeInformation(userData, isCompletion);
    return res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    console.error('Erreur completeProfil :', error);
    return res.status(500).json({ success: false, message: 'Erreur lors de l’enregistrement du profil.', error: error.message });
  }
};

/**
 * GET /info-praticien
 * Récupère les informations complètes du praticien.
 */
exports.getInfoPraticien = async (req, res) => {
  try {
    const id_user = req.user.id_user;
    const data = await UserService.getPractitionerInfo(id_user);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Erreur getInfoPraticien :', error);
    return res.status(500).json({ success: false, message: 'Impossible de récupérer les infos du praticien.', error: error.message });
  }
};



// controllers/user.controller.js

/**
 * POST /add-experience
 * Ajoute la date de début d'expérience (format YYYY-MM)
 */
exports.addExperience = async (req, res) => {
  try {
    const id_user = req.user.id_user;
    const { start_date } = req.body;

    // Validation du format de date
    if (!isValidDate(start_date)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Format de date invalide. Utilisez YYYY-MM' 
      });
    }

    const practInfo = await UserService.addExperienceYears(id_user, start_date);
    
    return res.status(200).json({
      success: true,
      data: {
        experiences_years: practInfo.experiences_years,
        start_date: practInfo.experiences_date.toISOString().split('T')[0].slice(0,7)
      },
      message: 'Expérience enregistrée avec succès'
    });

  } catch (error) {
    console.error('Erreur addExperience :', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'Erreur lors de l\'ajout de l\'expérience' 
    });
  }
};

/**
 * PUT /update-experience
 * Met à jour la date de début d'expérience
 */
exports.updateExperience = async (req, res) => {
  try {
    const id_user = req.user.id_user;
    const { start_date } = req.body;

    if (!isValidDate(start_date)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Format de date invalide. Utilisez YYYY-MM' 
      });
    }

    const practInfo = await UserService.updateExperienceYears(id_user, start_date);

    return res.status(200).json({
      success: true,
      data: {
        experiences_years: practInfo.experiences_years,
        start_date: practInfo.experiences_date.toISOString().split('T')[0].slice(0,7)
      },
      message: 'Expérience mise à jour avec succès'
    });

  } catch (error) {
    console.error('Erreur updateExperience :', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'Erreur lors de la mise à jour de l\'expérience' 
    });
  }
};

/**
 * GET /get-experience
 * Récupère les données d'expérience
 */
exports.getExperience = async (req, res) => {
  try {
    const id_user = req.user.id_user;
    const experience = await UserService.getExperienceYears(id_user);

    return res.status(200).json({ 
      success: true,
      data: {
        experiences_years: experience.experiences_years,
        start_date: experience.start_date
      }
    });

  } catch (error) {
    console.error('Erreur getExperience :', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'Erreur lors de la récupération de l\'expérience' 
    });
  }
};

// Fonction utilitaire de validation de date
function isValidDate(dateString) {
  // Validation du format YYYY-MM
  const regex = /^\d{4}-(0[1-9]|1[0-2])$/;
  if (!regex.test(dateString)) return false;

  // Validation de la date réelle
  const [year, month] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1);
  
  return date.getFullYear() === year && 
         date.getMonth() === month - 1 &&
         date <= new Date(); // La date ne doit pas être dans le futur
}
/**
 * GET /practitioner/payment-methods
 * Récupère la liste des modes de paiement du praticien connecté.
 */
exports.getPaymentMethods = async (req, res) => {
  try {
    const id_user = req.user.id_user;
    const methods = await UserService.getPaymentMethodsByPractitioner(id_user);
    return res.status(200).json({ success: true, data: methods });
  } catch (error) {
    console.error('Erreur getPaymentMethods :', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /practitioner/payment-methods
 * Remplace entièrement la liste des modes de paiement pour le praticien.
 * Body attendu : { paymentMethodIds: [1,2,3] }
 */
exports.setPaymentMethods = async (req, res) => {
  try {
    const id_user = req.user.id_user;
    const { paymentMethodIds } = req.body;
    if (!Array.isArray(paymentMethodIds)) {
      return res.status(400).json({ success: false, message: 'paymentMethodIds doit être un tableau d\'IDs.' });
    }
    await UserService.setPaymentMethodsForPractitioner(id_user, paymentMethodIds);
    return res.status(200).json({ success: true, message: 'Modes de paiement mis à jour.' });
  } catch (error) {
    console.error('Erreur setPaymentMethods :', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE /practitioner/payment-methods/:id
 * Supprime un mode de paiement spécifique pour le praticien.
 */
exports.removePaymentMethod = async (req, res) => {
  try {
    const id_user = req.user.id_user;
    const paymentMethodId = parseInt(req.params.id, 10);
    if (isNaN(paymentMethodId)) {
      return res.status(400).json({ success: false, message: 'ID de mode de paiement invalide.' });
    }
    await UserService.removePaymentMethodFromPractitioner(id_user, paymentMethodId);
    return res.status(200).json({ success: true, message: 'Mode de paiement supprimé.' });
  } catch (error) {
    console.error('Erreur removePaymentMethod :', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /practitioner/patient-types
 * Récupère la liste des types de patients du praticien connecté.
 */
exports.getPatientTypes = async (req, res) => {
  try {
    const id_user = req.user.id_user;
    const types = await UserService.getPatientTypesByPractitioner(id_user);
    return res.status(200).json({ success: true, data: types });
  } catch (error) {
    console.error('Erreur getPatientTypes :', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /practitioner/patient-types
 * Remplace entièrement la liste des types de patients pour le praticien.
 * Body attendu : { patientTypeIds: [1,2,3] }
 */
exports.setPatientTypes = async (req, res) => {
  try {
    const id_user = req.user.id_user;
    const { patientTypeIds } = req.body;
    if (!Array.isArray(patientTypeIds)) {
      return res.status(400).json({ success: false, message: 'patientTypeIds doit être un tableau d\'IDs.' });
    }
    await UserService.setPatientTypesForPractitioner(id_user, patientTypeIds);
    return res.status(200).json({ success: true, message: 'Types de patients mis à jour.' });
  } catch (error) {
    console.error('Erreur setPatientTypes :', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE /practitioner/patient-types/:id
 * Supprime un type de patient spécifique pour le praticien.
 */
exports.removePatientType = async (req, res) => {
  try {
    const id_user = req.user.id_user;
    const patientTypeId = parseInt(req.params.id, 10);
    if (isNaN(patientTypeId)) {
      return res.status(400).json({ success: false, message: 'ID de type de patient invalide.' });
    }
    await UserService.removePatientTypeFromPractitioner(id_user, patientTypeId);
    return res.status(200).json({ success: true, message: 'Type de patient supprimé.' });
  } catch (error) {
    console.error('Erreur removePatientType :', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPaymentOptions = async (req, res) => {
  try {
    const methods = await UserService.getAllPaymentMethods();
    return res.status(200).json({ success: true, data: methods });
  } catch (error) {
    console.error('Erreur getPaymentOptions :', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /options/patient-types
 * Récupère la liste de tous les types de patients disponibles.
 */
exports.getPatientTypeOptions = async (req, res) => {
  try {
    const types = await UserService.getAllPatientTypes();
    return res.status(200).json({ success: true, data: types });
  } catch (error) {
    console.error('Erreur getPatientTypeOptions :', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

