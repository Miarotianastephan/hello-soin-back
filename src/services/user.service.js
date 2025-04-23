const db = require('../models');
const User = db.User;


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
      is_home_consult
    } = userData;
  
    // Vérification des champs obligatoires
    if (!firstname || !lastname || !mail || !birthdate || !situation || !mobile_number) {
      throw new Error("Tous les champs obligatoires (nom, prénom, mail, date de naissance, civilité, téléphone) doivent être remplis.");
    }
    try {
      // Mise à jour de l'utilisateur
      const userToUpdate = await User.findByPk(id_user);
      if (!userToUpdate) {
        throw new Error("Utilisateur introuvable.");
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
  
      // Mise à jour des informations praticien
      const practInfo = await PractitionerInfo.findOne({ where: { id_user } });
      if (practInfo) {
        const pratInfoData = (isCompletion==true) ? {
            // Pour la completion du profil seulement
            siret,
            is_office_consult,
            is_visio_consult,
            is_home_consult,
            updated_at: new Date()
        } : { // pour la modification du profils 
            profil_description,
            facebook_link,
            linkedin_link,
            siret,
            is_office_consult,
            is_visio_consult,
            is_home_consult,
            updated_at: new Date()
        };
        await practInfo.update(pratInfoData);
      }
  
      return { success: true, message: "Informations mises à jour avec succès." };
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      throw error;
    }
  };