const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require('../config/auth');
const db = require('../models');


const UserRoleService = require("./user-role.service");
const UserService = require("./user.service");
const { isMailValidated } = require('./email-sender.service');
const PractitionerInfo  = db.PractitionerInfo;
const PractSpeciality = db.PractSpeciality;
const User = db.User;

exports.registerPraticien = async (requestData) => {
    try {
        
        if (!(await isMailValidated(requestData.mail))) { // vérification si le mail est validée
            throw new Error('Adresse mail non validée');
        }
        await UserService.checkExistEmail(requestData.mail);

        const role = await UserRoleService.getRoleByName("praticien");
        const roleId = role.id_user_role;
        const hashedPassword = await bcrypt.hash(requestData.password, 10);
        const dateInscri = new Date().toISOString().split('T')[0];
        const data = {
            firstname: requestData.firstname,
            lastname: requestData.lastname,
            mail: requestData.mail,
            mobile_number: requestData.mobile_number,
            situation: requestData.situation,
            postal_code: requestData.postal_code,
            city: requestData.city,
            password: hashedPassword,
            created_at: dateInscri,
            id_user_role: roleId,
        };
        // ajout en tant que user
        const user = await UserService.saveUser(data);
        // ajout en tant que praticien
        // + ajout du specialites par défaut du praticien
        const practicien = { id_user: user.id_user,}
        const specialities = requestData.id_speciality ? [requestData.id_speciality] : [];
        const resultPraticien = await createPractitionerInfo(practicien, specialities);
        // structurer la réponse pour retourner un token + user + profil praticien
        const token = jwt.sign(
            { id_user: user.id_user, role: user.id_user_role },
            jwtSecret,
            { expiresIn: '2h' }
        ); 
        const userData = user.toJSON();
        delete userData.password;
        // réponse finale pour manipulation des données
        const result = {
            message: 'Inscription réussie',
            token,
            user: userData,
            praticien: resultPraticien
        }
        return result;
    } catch (error) {
        console.error("Erreur d'inscription du praticien");
        throw error;
    }
}

async function createPractitionerInfo(data, specialityIds = []) {
    const transaction = await PractitionerInfo.sequelize.transaction();
  
    try {
      // Création du praticien
      const practitioner = await PractitionerInfo.create(data, { transaction });
  
      // S'il y a des spécialités à associer
      if (specialityIds.length > 0) {
        const links = specialityIds.map(id => ({
          id_pract_info: practitioner.id_pract_info,
          id_speciality: id,
          is_main: 1, // pratique par defaut lors de l'inscription
          created_at: new Date()
        }));
        await PractSpeciality.bulkCreate(links, { transaction });
      }
  
      await transaction.commit();
      return practitioner;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
}

exports.login = async (mail, password) => {
    try {
        // 1. Vérifier si l'utilisateur existe
        const user = await User.findOne({
            where: { mail },
            include: ['role', 'practitioner_info']
        });
        if (!user) {
            throw new Error('Utilisateur non trouvé.');
        }
        // 2. Vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Mot de passe incorrect.');
        }
        // 3. Générer un token JWT
        const token = jwt.sign(
            { id_user: user.id_user, role: user.id_user_role },
            jwtSecret,
            { expiresIn: '2h' }
        );
        // 4. Supprimer le mot de passe avant de retourner l'objet
        const userData = user.toJSON();
        delete userData.password;
        const result = {
            message: 'Connexion réussie.',
            token,
            user: userData
        };
        return result;
  
    } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        throw error;
    }
};