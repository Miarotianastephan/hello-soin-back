// services/email-sender.service.js
const { Op } = require('sequelize');
const db = require('../models');
const sendValidationEmail = require('../utils/email-sender');
const EmailValidationCode = db.EmailValidationCode;

exports.sendCode = async (mail) => {
  // 1. Génération et stockage du code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 10 * 60000); // +10min

  await EmailValidationCode.create({
    mail,
    code,
    created_at: now,
    expires_at: expiresAt
  });

  // 2. Envoi par e-mail
  await sendValidationEmail(mail, code);

  // 3. **Retourner** le code pour l’envoi SMS  
  return code;
};


exports.verifyCode = async(mail, code) => {
  const record = await EmailValidationCode.findOne({
    where: {
      mail,
      code,
      expires_at: { [Op.gt]: new Date() },
      validated: false
    }
  });

  if (!record) throw new Error('Code invalide ou expiré.');

  record.validated = true;
  await record.save();
}

exports.isMailValidated = async (mail) => {
    const record = await EmailValidationCode.findOne({
      where: { mail, validated: true }
    });
    return !!record;
};