const express = require("express");
const router = express.Router();

const ProfilPraticienController = require('../../controllers/profil-praticien.controller');
const uploadMiddleware = require('../../middlewares/upload-middlewares');
const uploadDocs = require('../../middlewares/upload-multiple-middlewares');
const { middleware_global } = require('../../middlewares/auth-middlewares');

// Utilisation du middlewares pour capturer la requete
// afin de vérifier si un Token est valide avant les opérations
router.use(middleware_global);

// completion + edit profil
router.post("/complete-profil",uploadMiddleware.single("profil_photo"), ProfilPraticienController.completeProfil);

// crud formations : ajout de multiples formations une seule fois
router.post("/getall-formations",ProfilPraticienController.getAllFormations);
router.post("/add-formations", uploadDocs.array('support_docs', 5), ProfilPraticienController.createFormations);
// router.post("/update-formation",ProfilPraticienController.updateFormation); ENCORE A DEVELOPPER
router.post("/delete-formation",ProfilPraticienController.deleteFormation);

module.exports = router;