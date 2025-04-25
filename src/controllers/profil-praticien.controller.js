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