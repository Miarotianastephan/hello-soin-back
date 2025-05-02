// sendValidationEmail.js
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");


const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === "true", // SSL pour port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendValidationEmail(to, code) {
  const mailOptions = {
    from: `"HelloSoins" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Votre code de validation",
    text: `Bonjour,\n\nVoici votre code de validation : ${code}\n\nSi vous n'avez pas demandé ce code, ignorez cet e‑mail.`,
    html: emailBodyTemplate(to, code),
  };

  await transporter.sendMail(mailOptions);
}

const emailBodyTemplate = (name, tempCode) => `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Vérification de compte</title>
  <style>
    body, p, h1, a { margin: 0; padding: 0; }
    body {
      background-color: #f8f9fa;
      font-family: Arial, sans-serif;
      line-height: 1.4;
      color: #343a40;
    }
    .wrapper {
      max-width: 600px; margin: 0 auto; padding: 20px;
    }
    .card {
      background: #fff; border-left: 4px solid rgb(28, 121, 90);
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
      border-radius: 4px; overflow: hidden;
    }
    .card-body { padding: 24px; text-align: center; }
    p { margin: 16px 0; text-align: left; }
    a { color:rgb(46, 70, 88); text-decoration: none; }
    a:hover { text-decoration: underline; }
    .verification-code {
      display: block; text-align: center;
      font-size: 2rem; font-weight: bold;
      color: #343a40; margin: 1.5rem 0;
    }
    .footer {
      background: #343a40; color: #fff;
      font-size: 0.875rem; text-align: center;
      padding: 16px; margin-top: 16px;
      border-radius: 0 0 4px 4px;
    }
    .footer a {
      color: #fff; margin: 0 8px; display: inline-block;
    }
    .footer a:hover { text-decoration: underline; }
    @media only screen and (max-width: 480px) {
      .wrapper { padding: 12px; }
      .card-body { padding: 16px; }
      .verification-code { font-size: 1.75rem; }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="card-body">
        <!-- Logo HelloSoins en Base64 -->
        <a href="https://www.hellosoins.fr" style="display:inline-block; margin-bottom:20px;">
          <img
            src="https://front.passion-vins.fr/assets/main_logo-DdMi8ySy.png"
            alt="Logo HelloSoins"
            style="max-width:150px; height:auto; display:block;"
          >
        </a>

        <!-- Contenu du message -->
        <p>Bonjour <strong>${name}</strong>,</p>
        <p>
          Pour finaliser la création de votre compte praticien, veuillez utiliser
          le code de confirmation ci‑dessous :
        </p>

        <!-- Code de vérification -->
        <span class="verification-code">${tempCode}</span>

        <p>
          Besoin d’aide ? Notre support est à votre disposition sur
          <a href="mailto:hellosoins@contact.com">hellosoins@contact.com</a>.
        </p>
        <p>
          Bienvenue sur
          <a href="https://www.hellosoins.fr">Hellosoins</a> !<br>
          L’équipe HelloSoins
        </p>
      </div>
    </div>

    <!-- Pied de page -->
    <div class="footer">
      <a href="https://www.hellosoins.fr/politique-de-confidentialite">
        Politique de confidentialité
      </a> |
      <a href="https://www.hellosoins.fr/faq">FAQ &amp; Aide</a><br>
      © 2025 HelloSoins – Tous droits réservés
    </div>
  </div>
</body>
</html>
`;

module.exports = sendValidationEmail;
