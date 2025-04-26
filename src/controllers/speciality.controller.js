// speciality.controller.js
const SpecialityService = require('../services/speciality.service');
const FormationService = require('../services/formation.service');

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

// New: Get only the 'designation' field for a speciality by its ID
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

