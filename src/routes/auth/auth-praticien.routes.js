const express = require("express");
const router = express.Router();

const AuthPraticienController = require("../../controllers/auth-praticien.controller");

router.post("/register", AuthPraticienController.register); // test oke register (sans validation d'email) 
router.post("/login", AuthPraticienController.login); // test oke login 
router.post("/emailLogin", AuthPraticienController.loginByEmail); // test oke login 
router.post("/verify-email", AuthPraticienController.verifyEmail);

module.exports = router;