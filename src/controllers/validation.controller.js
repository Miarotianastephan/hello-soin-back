const EmailSenderService = require("../services/email-sender.service");

// Fonction pour envoyer un code de validation par mail
exports.sendCode = async (req, res) => {
    try {
        const { mail } = req.body;
        await EmailSenderService.sendCode(mail);
        res.status(200).json({ message: 'Code envoyé avec succès.' });   
    } catch (error) {
        res.status(401).json({ message: error.message || "Erreur d'envoye du code." });   
    }
};

// Fonction pour vérifier le code de validation
exports.verifyCode = async (req, res) => {
    try {
        const { mail, code } = req.body;
        await EmailSenderService.verifyCode(mail, code);
        res.status(200).json({ message: 'Code validé, vous pouvez finaliser votre inscription.' });
    } catch (error) {
        res.status(200).json({ message: error.message || 'Code non validé, veuillez entrer le bon code.' });
    }
};
