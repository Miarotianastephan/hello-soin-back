const AuthPraticienService = require("../services/auth-praticien.service");

exports.register = async(req, res) => {
    try {
        const requestData = req.body;
        const result = await AuthPraticienService.registerPraticien(requestData);
        console.log(result.message);
        res.status(200).json({
            success: true,
            message: "Inscription du nouveau Praticien réussie",
            token: result.token,
            user: result.user,
            praticien: result.praticien
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: error.message || "Inscription échoué !",
        });
    }
}

exports.login = async(req,res) => {
    try {
        const { mail, password } = req.body;
        const result = await AuthPraticienService.login(mail, password);
        console.log(result.message);
        res.status(200).json({
            success: true,
            message: "Connexion en tant que Praticien réussi",
            token: result.token,
            user: result.user
        })
    } catch (error) {
        res.status(401).json({
            success: false,
            message: error.message || "Connexion échoué !",
        });
    }
}

exports.loginByEmail = async (req, res) => {
    try {
      const { mail } = req.body;
      const result = await AuthPraticienService.loginByEmail(mail);
      console.log(result.message);
      res.status(200).json({
        success: true,
        message: "Connexion sans mot de passe réussie",
        token: result.token,
        user: result.user
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message || "Connexion échouée !",
      });
    }
};