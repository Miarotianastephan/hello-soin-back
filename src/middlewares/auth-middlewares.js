const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET;

// Middlewares utilisées pour vérifier si
// l'accès est authentifier avant toute opération
function middleware_global(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).json({ message: "Accès refusé token requis" });
  }
  jwt.verify(token.split(" ")[1], SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token invalide ou expiré" });
    }
    req.user = decoded;
    next();
  });
}

module.exports = {
    middleware_global,
};