const UserService = require('../services/user.service');

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
      is_office_consult: Boolean(body.is_office_consult),
      is_visio_consult: Boolean(body.is_visio_consult),
      is_home_consult: Boolean(body.is_home_consult),
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
