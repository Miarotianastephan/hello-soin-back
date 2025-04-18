const express = require("express");
const router = express.Router();

const ValidationController = require('../../controllers/validation.controller')

router.post("/send-code", ValidationController.sendCode);
router.post("/verify-code", ValidationController.verifyCode);

module.exports = router;