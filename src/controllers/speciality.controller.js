const SpecialityService = require('../services/speciality.service');
const FormationService = require('../services/formation.service');

exports.getAllSpeciality = async (req,res) => {
    try {
        const speciality = await SpecialityService.findAll();
        return res
            .status(200)
            .json({
                data: speciality,
                message: "Récupérations des spécialités"
            })
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ message: "Erreur de Récupérations des spécialités", error: error.message })
    }
}

exports.getSpecialityByPraticien = async (req, res) => {
  try {
    const id_user = req.user.id_user;
    const data = await FormationService.getSpecialitiesByUserId(id_user);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Erreur Specialite Praticien :', error);
    return res.status(500).json({ success: false, message: 'Impossible de récupérer les specialites du praticien.', error: error.message });
  }
};