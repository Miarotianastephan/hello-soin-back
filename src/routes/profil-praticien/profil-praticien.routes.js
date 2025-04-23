const express = require("express");
const router = express.Router();

const ProfilPraticienController = require('../../controllers/profil-praticien.controller');
const uploadMiddleware = require('../../middlewares/upload-middlewares');
const { middleware_global } = require('../../middlewares/auth-middlewares');

// Utilisation du middlewares pour capturer la requete
// afin de vérifier si un Token est valide avant les opérations
router.use(middleware_global);
router.post("/complete-profil",uploadMiddleware.single("profil_photo"), ProfilPraticienController.completeProfil);

module.exports = router;