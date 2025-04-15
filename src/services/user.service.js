const User = require("../models/user.model");

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