const SpecialityService = require('../services/speciality.service');

exports.getAllSpeciality = async (req, res) => {
  try {
    const speciality = await SpecialityService.findAll();
    return res.status(200).json({
      data: speciality,
      message: "Récupération des spécialités"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur de récupération des spécialités", error: error.message });
  }
};

exports.getSpecialityByPraticien = async (req, res) => {
  try {
    const id_user = req.user.id_user;
    const data = await FormationService.getSpecialitiesByUserId(id_user);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Erreur Specialite Praticien :', error);
    return res.status(500).json({ success: false, message: 'Impossible de récupérer les spécialités du praticien.', error: error.message });
  }
};

exports.getDesignationById = async (req, res) => {
  try {
    const { id } = req.params;
    const speciality = await SpecialityService.findDesignationById(id);
    if (!speciality) {
      return res.status(404).json({ message: "Spécialité non trouvée" });
    }
    return res.status(200).json({
      data: { designation: speciality.designation },
      message: "Récupération de la désignation de la spécialité"
    });
  } catch (error) {
    console.error('Erreur récupération désignation spéciale :', error);
    return res.status(500).json({ message: 'Erreur lors de la récupération de la désignation.', error: error.message });
  }
};

// ✨ Nouvelle action : créer une spécialité
exports.createSpeciality = async (req, res) => {
  try {
    const { designation } = req.body;

    if (!designation || typeof designation !== 'string') {
      return res.status(400).json({ message: "Le champ 'designation' est requis et doit être une chaîne de caractères." });
    }

    const newSpeciality = await SpecialityService.create({ designation });

    return res.status(201).json({
      data: newSpeciality,
      message: "Création de la spécialité réussie"
    });
  } catch (error) {
    console.error('Erreur création spécialité :', error);
    return res.status(500).json({ message: "Impossible de créer la spécialité.", error: error.message });
  }
};
