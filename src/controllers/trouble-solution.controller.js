const TroubleSolutionService = require('../services/trouble-solution.service');
const SpecialityService = require('../services/speciality.service');


exports.findAllTroubleSolution = async(req, res) => {
    try {
        const speciality = await SpecialityService.findAll();
        const troubleSolutions = await TroubleSolutionService.getSolutionsGroupedByTrouble();
        return res.status(200).json({
            speciality,
            troubleSolutions,
            message: "Récupération des troubles solutions completer"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur de récupération des troubles solutions", error: error.message });
    }
}

exports.createPraticienApproaches = async(req, res) => {
    try {
        const id_user = req.user.id_user;
        const data_trouble = req.body;
        const manageTrouble = await TroubleSolutionService.createPraticienApproaches(id_user, data_trouble);
        return res.status(200).json({
            manageTrouble,
            message: "Insertion des troubles reussis !!"
        });
    } catch (error) {
        return res.status(500).json({ message: "Erreur de la creation des approches", error: error.message });
    }
}

exports.getPractitionerApproachesFormatted = async(req, res) => {
    try {
        const id_user = req.user.id_user;
        const approches = await TroubleSolutionService.getPractitionerApproachesFormatted(id_user);
        return res.status(200).json({
            data: approches,
            message: "Get approvhes for praticien"
        });
    } catch (error) {
        return res.status(500).json({ message: "Erreur de récupération des approches", error: error.message });
    }
}

exports.deletePraticienApproaches = async(req, res) => {
    try {
        const id_user = req.user.id_user;
        const data_trouble = req.body;
        const response = await TroubleSolutionService.deletePraticienApproches(id_user, data_trouble.id);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ message: "Erreur de suppression des approches", error: error.message });
    }
}