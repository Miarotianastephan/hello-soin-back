const db = require('../models');
const { sequelize } = require('../config/database');
const TroubleSolution = db.TroubleSolution;
const PractitionerInfo = db.PractitionerInfo;
const PractSpeciality = db.PractSpeciality;
const PractitionerApproach = db.PractitionerApproach;
const Trouble = db.Trouble;
const Speciality = db.Speciality;
const Solution = db.Solution;
const TroubleCategory = db.TroubleCategory;

exports.getSolutionsGroupedByTrouble = async () => {
    const troubleSolutions = await TroubleSolution.findAll({
      include: [
        {
          model: db.Trouble,
          as: 'trouble',
          attributes: ['id_trouble', 'designation']
        },
        {
          model: db.Solution,
          as: 'solution',
          attributes: ['id_solution','designation']
        },
        {
          model: db.Speciality,
          as: 'speciality',
          attributes: ['id_speciality', 'designation']
        }
      ]
    });
  
    // Regrouper par troubles
    const grouped = {};
  
    for (const ts of troubleSolutions) {
      const troubleId = ts.trouble.id_trouble;
      const troubleName = ts.trouble.designation;
  
      if (!grouped[troubleId]) {
        grouped[troubleId] = {
          id: troubleId,
          name: troubleName,
          solutions: []
        };
      }
  
      grouped[troubleId].solutions.push({
        text: ts.solution.designation,
        solution: ts.solution.id_solution,
        specialty: ts.speciality.id_speciality
      });
    }
  
    // Sous forme de tableau ny valiny
    return Object.values(grouped);
};

exports.createPraticienApproaches = async (id_user, data_trouble) => {
    const transaction = await sequelize.transaction();
  
    try {
      // Étape 1 : Récupérer les infos du praticien
      const practInfo = await PractitionerInfo.findOne({
        where: { id_user },
        attributes: ['id_pract_info'],
        transaction
      });
      if (!practInfo) {
        throw new Error("Praticien introuvable.");
      }
      const id_pract_info = practInfo.id_pract_info;
      const createdApproaches = [];
  
      for (const solution of data_trouble.solutions) {
        const specialtyId = solution.specialty;
        // Étape 2 : Vérifier si la spécialité existe déjà pour le praticien
        let practSpeciality = await PractSpeciality.findOne({
          where: {
            id_speciality: specialtyId,
            id_pract_info: id_pract_info
          },
          transaction
        });
        // Étape 3 : Si la spécialité n'existe pas, on l'ajoute
        if (!practSpeciality) {
          practSpeciality = await PractSpeciality.create({
            id_speciality: specialtyId,
            id_pract_info: id_pract_info,
            default_fee_value: null,
            is_main: 0
          }, { transaction });
        }
        // Étape 4 : Créer l'approche du praticien
        const created = await PractitionerApproach.create({
          id_pract_info: id_pract_info,
          id_trouble: data_trouble.id,
          id_solution: solution.solution,
          id_pract_speciality: practSpeciality.id_pract_speciality
        }, { transaction });
  
        createdApproaches.push(created);
      }
      // Si tout s’est bien passé
      await transaction.commit();
      return createdApproaches;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
};

//   Pour avoir les approches du praticien 
exports.getPractitionerApproachesFormatted = async (id_user) => {
    const practInfo = await PractitionerInfo.findOne({
      where: { id_user },
      attributes: ['id_pract_info']
    });
  
    if (!practInfo) {
      throw new Error('Praticien introuvable');
    }

    const test = await PractSpeciality.findAll({
        include: [
          {
            model: Speciality,
            as: 'speciality'
          }
        ]
      });
    console.log(JSON.stringify(test, null, 2));
  
    const approaches = await PractitionerApproach.findAll({
      where: { id_pract_info: practInfo.id_pract_info },
      include: [
        {
          model: Trouble,
          as: 'trouble',
          attributes: ['id_trouble', 'designation', 'id_trouble_category'],
          include: [
            {
              model: TroubleCategory,
              as: 'category',
              attributes: ['id_trouble_category', 'designation']
            }
          ]
        },
        {
          model: Solution,
          as: 'solution',
          attributes: ['id_solution', 'designation']
        },
        {
          model: PractSpeciality,
          as: 'practSpeciality',
          attributes: ['id_pract_speciality', 'id_speciality'],
          include: [
            {
              model: Speciality,
              as: 'speciality',
              attributes: ['id_speciality', 'designation']
            }
          ]
        }
      ]
    });
    const categoryMap = {};
  
    for (const approach of approaches) {
      const { trouble, solution, practSpeciality } = approach;
      const category = trouble.category;
      const speciality = practSpeciality?.speciality;
  
    //   console.log(practSpeciality);
      if (!categoryMap[category.id_trouble_category]) {
        categoryMap[category.id_trouble_category] = {
          id: category.id_trouble_category,
          categorie: category.designation,
          troubles: []
        };
      }
  
      const categoryEntry = categoryMap[category.id_trouble_category];
  
      let troubleEntry = categoryEntry.troubles.find(t => t.id === trouble.id_trouble);
      if (!troubleEntry) {
        troubleEntry = {
          id: trouble.id_trouble,
          name: trouble.designation,
          duree: null, // À compléter si tu ajoutes "duree" au modèle Trouble
          tarif: null, // À compléter aussi
          solutions: []
        };
        categoryEntry.troubles.push(troubleEntry);
      }
  
      troubleEntry.solutions.push({
        id: solution.id_solution,
        name: solution.designation,
        specialite: speciality?.designation || null
      });
    }
  
    return Object.values(categoryMap);
};

// supprimer un torubles approches 
exports.deletePraticienApproches = async (id_user, id_trouble) => {
    const transaction = await sequelize.transaction();
    try {
      // Étape 1 : Récupérer les infos du praticien
      const practInfo = await PractitionerInfo.findOne({
        where: { id_user },
        attributes: ['id_pract_info'],
        transaction
      });
  
      if (!practInfo) {
        throw new Error('Praticien introuvable.');
      }
  
      // Étape 2 : Suppression définitive des approches
      const deletedCount = await PractitionerApproach.destroy({
        where: {
          id_pract_info: practInfo.id_pract_info,
          id_trouble
        },
        transaction
      });
  
      await transaction.commit();
  
      return {
        success: true,
        message: `${deletedCount} approche(s) supprimée(s).`
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
};