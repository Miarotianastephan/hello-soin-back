const express = require("express");
const router = express.Router();

const AuthPraticienController = require("../../controllers/auth-praticien.controller"); 

router.post("/register", AuthPraticienController.register);
router.post("/login", AuthPraticienController.login);