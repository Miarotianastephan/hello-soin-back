// controllers/auth.controller.js
require('dotenv').config();
const EmailSenderService = require('../services/email-sender.service');  // <-- ici !
const twilio = require('twilio');

const accountSid   = process.env.TWILIO_ACCOUNT_SID   || 'AC31a05c29b562d9618367cd25d47f6e72';
const authToken    = process.env.TWILIO_AUTH_TOKEN    || 'a2f4a64e03f84a2392d76807f293653b';
const twilioNumber = process.env.TWILIO_PHONE_NUMBER || '+18483530896';
const client = twilio(accountSid, authToken);

exports.sendCode = async (req, res) => {
  try {
    const { mail, numero } = req.body;
    // Récupération du code grâce au return
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

// Fonction pour vérifier le code de validation
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
