const UserService = require('../services/user.service');

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