const express = require("express");
const router = express.Router();

const TroublesSolutionsController = require('../../controllers/trouble-solution.controller');

router.get('/getTroubleSolution', TroublesSolutionsController.findAllTroubleSolution);

module.exports = router;