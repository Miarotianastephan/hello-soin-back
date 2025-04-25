const express = require("express");
const router = express.Router();
const { middleware_global } = require('../../middlewares/auth-middlewares');

const ProfilPraticienController = require('../../controllers/profil-praticien.controller');
const SpecialityController = require('../../controllers/speciality.controller');
const uploadMiddleware = require('../../middlewares/upload-middlewares');
const uploadDocs = require('../../middlewares/upload-multiple-middlewares');
const uploadProfilPhoto = require('../../middlewares/upload-photo');

// Middleware pour capturer le token
router.use(middleware_global);

// Routes gestion de profil
router.post("/complete-profil",uploadProfilPhoto,ProfilPraticienController.completeProfil);
router.get("/get-info-praticien",uploadMiddleware.any(), ProfilPraticienController.getInfoPraticien);

// Routes gestion des formations
router.get("/getall-formations",ProfilPraticienController.getAllFormations);
router.post("/add-formations", uploadDocs.array('support_docs', 5), ProfilPraticienController.createFormations);
router.post("/delete-formation",ProfilPraticienController.deleteFormation);
// router.post("/update-formation",ProfilPraticienController.updateFormation); ENCORE A DEVELOPPER

// Routes gestion specialités
router.get("/get-speciality-praticien", SpecialityController.getSpecialityByPraticien);

module.exports = router;