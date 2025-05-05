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

exports.getAllFormations= async (req, res) => {
    try {
        const formations = await FormationService.getAllFormationsByID(req.user.id_user);
        return res
            .status(200)
            .json({
                data: formations,
                message: "Récupérations des formations de l'utilisateurs"
            })
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ message: "Erreur de Récupérations des formations", error: error.message })
    }
}

exports.createFormations = async (req, res) => {
    try {
        
        // Log des données reçues
        console.log('req.body:', req.body);
        console.log('req.files:', req.files);
        const { files, user } = req;
        const {
            institution_name,
            obtained_at,
            certification_name,
            certification_number,
            id_pract_speciality
        } = req.body;

        const pratInfo = await FormationService.findPraticienInfoById(user.id_user);
        const id_pract_info = pratInfo.id_pract_info;

        // Étape 2 : Validation des données
        if (!institution_name || !obtained_at || !certification_name || !id_pract_info || !id_pract_speciality) {
            return res.status(400).json({ message: 'Tous les champs requis ne sont pas fournis.' });
        }

        // Étape 3 : Construction de l'objet de données
        const formationData = {
            institution_name,
            obtained_at,
            certification_name,
            id_pract_info,
            certification_number: certification_number || null,
        };
        const support_docs = []

        // Gestion des fichiers uploadés
        if (files && files.length > 0) {
            files.forEach(file => {
                support_docs.push({
                    doc_photo_url: file.filename,
                    doc_url: file.filename
                });
            });
        }

        // Étape 4 : Appel au service
        const newFormation = await FormationService.createFormation(formationData, id_pract_speciality, support_docs);

        // Étape 5 : Réponse réussie
        return res.status(201).json({
            message: 'Formation créée avec succès.',
            data: newFormation
        });

    } catch (error) {
        console.error('Erreur lors de la création de la formation :', error);
        return res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
};

exports.deleteFormation = async (req, res) => {
    try {
        const { id_formation } = req.body
        await FormationService.deleteFormation(id_formation);
        return res.status(201).json({
            message: 'Suppression avec succès.'
        });
    } catch (error) {
        console.error('Erreur lors de la suppression de la formation :', error);
        return res.status(500).json({ message: error.message || 'Erreur interne du serveur.' });   
    }
}


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

