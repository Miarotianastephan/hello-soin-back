const express = require("express");
const router = express.Router();

const SpecialityController = require('../../controllers/speciality.controller');

router.get('/specialities', SpecialityController.getAllSpeciality);

module.exports = router