const UserService = require('../services/user.service');
const FormationService = require('../services/formation.service');

exports.completeProfil = async (req, res) => {
    try {
        const { body, file } = req;
        // Ajouter le nom du fichier dans les données à envoyer au service
        const userData = {
            ...body,
            id_user: req.user.id_user, // access au requete apres traitement du middleware
            profil_photo: file ? file.filename : null
        };
    
        // utilisation d'un boolean pour dire si c'est un completion de profil ou une modification
        if(!userData.isCompletion){
            throw new Error("Indiquez si c'est un completion ou edit du profil !");
        }
        await UserService.completeInformation(userData, userData.isCompletion);
    
        return res.status(200).json({ message: 'Profil complété avec succès.' });
    } catch (error) {
        console.error("Erreur dans completeProfil:", error);
        return res.status(500).json({ message: 'Erreur lors de la complétion du profil.', error: error.message });
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
        const { body, files, user } = req;
        // Étape 1 : Extraction des données
        const {
            institution_name,
            obtained_at,
            certification_name,
            certification_number,
            id_pract_speciality
        } = body;

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