// controllers/auth.controller.js
require('dotenv').config();  // Charger .env en haut du fichier

const EmailSenderService = require('../services/email-sender.service');
const twilio = require('twilio');

// Lecture depuis process.env
const accountSid   = process.env.TWILIO_ACCOUNT_SID;
const authToken    = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
const client       = twilio(accountSid, authToken);

exports.sendCode = async (req, res) => {
  try {
    const { mail, numero } = req.body;
    // Récupération du code
    const code = await EmailSenderService.sendCode(mail);

    if (numero) {
      await client.messages.create({
        body: `Votre code de validation est : ${code}`,
        from: twilioNumber,
        to: numero
      });
    }
    res.status(200).json({ message: 'Code envoyé avec succès.' });
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur d'envoi du code." });
  }
};

exports.verifyCode = async (req, res) => {
  try {
    const { mail, code } = req.body;
    await EmailSenderService.verifyCode(mail, code);

    return res.status(200).json({ 
      message: 'Code validé, vous pouvez finaliser votre inscription.',
      status : true
    });
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Code non validé, veuillez entrer le bon code.' });
  }
};
