const express = require("express");
const router = express.Router();
const { middleware_global } = require('../../middlewares/auth-middlewares');

const ProfilPraticienController = require('../../controllers/profil-praticien.controller');
const FormationController = require('../../controllers/formation.controller');
const SpecialityController = require('../../controllers/speciality.controller');
const uploadMiddleware = require('../../middlewares/upload-middlewares');
const uploadDocs = require('../../middlewares/upload-multiple-middlewares');
const uploadProfilPhoto = require('../../middlewares/upload-photo');

// Middleware pour capturer le token
router.use(middleware_global);

// Routes gestion de profil
router.post("/complete-profil", uploadProfilPhoto, ProfilPraticienController.completeProfil);
router.get("/get-info-praticien", uploadMiddleware.any(), ProfilPraticienController.getInfoPraticien);

// Routes gestion des formations
router.get("/getall-formations", FormationController.getAllFormations);
router.post("/add-formations", uploadDocs.array('support_docs', 5), FormationController.createFormations);
router.post("/delete-formation", FormationController.deleteFormation);

// Routes gestion specialités
router.get("/get-speciality-praticien", SpecialityController.getSpecialityByPraticien);

// Gestion des années d'expérience
router.post('/add-experience', ProfilPraticienController.addExperience);
router.put('/update-experience', ProfilPraticienController.updateExperience);
router.get('/get-experience', ProfilPraticienController.getExperience);

// Routes gestion des modes de paiement
router.get('/payment-methods', ProfilPraticienController.getPaymentMethods);
router.post('/payment-methods', ProfilPraticienController.setPaymentMethods);
router.delete('/payment-methods/:id', ProfilPraticienController.removePaymentMethod);

// Routes gestion des types de patients
router.get('/patient-types', ProfilPraticienController.getPatientTypes);
router.post('/patient-types', ProfilPraticienController.setPatientTypes);
router.delete('/patient-types/:id', ProfilPraticienController.removePatientType);

// Routes options globales
router.get('/options/payment-methods', ProfilPraticienController.getPaymentOptions);
router.get('/options/patient-types', ProfilPraticienController.getPatientTypeOptions);

module.exports = router;
