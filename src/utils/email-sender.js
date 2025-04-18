const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true', // SSL pour port 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
async function sendValidationEmail(to, code) {
    const mailOptions = {
        from: `"HelloSoin" <${process.env.EMAIL_USER}>`,
        to,
        subject: 'Votre code de validation',
        text: `Voici votre code de validation : ${code}`,
        html: `<p>Bonjour,</p><p>Votre code de validation est : <strong>${code}</strong></p><p>Ce code expirera dans 10 minutes.</p>`
    };

    await transporter.sendMail(mailOptions);
}

module.exports = sendValidationEmail;