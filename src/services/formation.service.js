const { 
    Formation, 
    FormationSpeciality, 
    FormationSupportDoc,
    PractitionerInfo
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
        include: ['formation_specialities', 'support_docs']
    })
}

exports.createFormation = async (data, specialities = null, docs = []) => {
    const transaction = await Formation.sequelize.transaction();
    try {
        const formation = await Formation.create(data, { transaction });
    
        // Lier les spécialités
        if (specialities != null) {
            // const specialitiesToInsert = specialities.map(id => ({
            const specialitiesToInsert = {
                id_formation: formation.id_formation,
                id_pract_speciality: specialities,
                id_pract_info: data.id_pract_info,
            }
            // }));
            await FormationSpeciality.bulkCreate(specialitiesToInsert, { transaction });
        }
    
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