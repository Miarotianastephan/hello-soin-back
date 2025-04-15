const UserRole = require('../models/user-role.model');

exports.getRoleByName = async (roleName) => {
    try {
        const role = await UserRole.findOne({
            where: { designation: roleName }
        });

        if (!role) {
            console.log("Aucun rôle trouvé !");
            return null;
        }
        console.log("Rôle trouvé :", role.designation);
        return role;
    } catch (error) {
        console.error("Erreur lors de la récupération du rôle :", error.message);
        throw error;
    }
}

