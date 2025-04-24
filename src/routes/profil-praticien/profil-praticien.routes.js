const express = require("express");
const router = express.Router();

const ProfilPraticienController = require('../../controllers/profil-praticien.controller');
const uploadMiddleware = require('../../middlewares/upload-middlewares');
const { middleware_global } = require('../../middlewares/auth-middlewares');
const uploadProfilPhoto = require('../../middlewares/upload-photo');
// Utilisation du middlewares pour capturer la requete
// afin de vérifier si un Token est valide avant les opérations
router.use(middleware_global);
router.post(
    "/complete-profil",
    uploadProfilPhoto, // Utilisation du nouveau middleware
    ProfilPraticienController.completeProfil
  );
router.get("/get-info-praticien",uploadMiddleware.any(), ProfilPraticienController.getInfoPraticien);

module.exports = router;