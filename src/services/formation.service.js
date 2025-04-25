const { 
    Formation, 
    FormationSpeciality, 
    FormationSupportDoc,
    PractitionerInfo,
    PractSpeciality,
    Speciality
} = require('../models');

exports.findPraticienInfoById = async(id_user) => {
    const praticienInfo = await PractitionerInfo.findOne({
        where: {id_user}
    })
    return praticienInfo;
}

exports.getAllFormationsByID = async (id_user) => {
    const pratInfo = await this.findPraticienInfoById(id_user);
    const id_pract_info = pratInfo.id_pract_info;

    return await Formation.findAll({
        where: { id_pract_info },
        include: [
            {
                association: 'formation_specialities',
                include: [
                    {
                        association: 'pract_speciality',
                        include: [
                            {
                                model: Speciality
                            }
                        ]
                    }
                ]
            },
            {
                association: 'support_docs'
            }
        ]
    });
}

exports.createFormation = async (data, specialities, docs = []) => {
    const transaction = await Formation.sequelize.transaction();
    try {
        const formation = await Formation.create(data, { transaction });
    
        // Lier les spécialités
        // if (specialities) {
            // const specialitiesToInsert = specialities.map(id => ({
            const specialitiesToInsert = {
                id_formation: formation.id_formation,
                id_pract_speciality: specialities,
                id_pract_info: data.id_pract_info,
            }
            // }));
            await FormationSpeciality.create(specialitiesToInsert, { transaction });
        // }
    
        // Ajouter les documents
        if (docs.length > 0) {
            const docsToInsert = docs.map(doc => ({
            id_formation: formation.id_formation,
            doc_photo_url: doc.doc_photo_url,
            doc_url: doc.doc_url,
            }));
            await FormationSupportDoc.bulkCreate(docsToInsert, { transaction });
        }
    
        await transaction.commit();
        return formation;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

exports.deleteFormation = async (id) => {
    const formation = await Formation.findByPk(id);
    if (!formation) {
      throw new Error('Formation not found');
    }
  
    // Supprimer les spécialités associées
    await FormationSpeciality.destroy({ where: { id_formation: id } });
  
    // Supprimer les documents de support associés
    await FormationSupportDoc.destroy({ where: { id_formation: id } });
  
    // Supprimer la formation
    await formation.destroy();
    return true;
};

exports.updateFormation = async (id, updateData) => {
    // En cours
};

exports.getSpecialitiesByUserId = async(id_user) => {
    try {
        const practitionerInfo = await PractitionerInfo.findOne({
            where: { id_user },
        });
    
        if (!practitionerInfo) {
            throw new Error('Praticien introuvable pour cet utilisateur');
        }
    
        const practSpecialities = await PractSpeciality.findAll({
            where: { id_pract_info: practitionerInfo.id_pract_info },
            include: [
            {
                model: Speciality,
                required: true
            }
            ]
        });
    
        // On ne renvoie que les spécialités (optionnel : tu peux aussi renvoyer les PractSpecialities complètes)
        //   const specialities = practSpecialities.map(ps => ps.Speciality);
    
        return practSpecialities;
    } catch (error) {
        console.error("Erreur lors de la récupération des spécialités :", error);
        throw error;
    }
}