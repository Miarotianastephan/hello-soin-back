const express = require("express");
const router = express.Router();

const SpecialityController = require('../../controllers/speciality.controller');

router.get('/specialities', SpecialityController.getAllSpeciality);

// Retrieve specialities for the authenticated practitioner
router.get('/specialities/praticien', SpecialityController.getSpecialityByPraticien);

// Retrieve only the designation of a speciality by its ID
router.get('/specialities/:id/designation', SpecialityController.getDesignationById);



module.exports = router;