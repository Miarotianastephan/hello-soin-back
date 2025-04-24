const express = require('express');
const cors = require('cors');
const path = require('path');

const errorHandler = require('./middlewares/errorHandler');
const authRoutes = require('./routes/auth/auth-praticien.routes');
const validationRoutes = require('./routes/mail/validation.routes');
const profilPratiicienRoutes = require('./routes/profil-praticien/profil-praticien.routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Mise en place des routes
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads'))); 
// exemple d'accès http://localhost:3000/uploads/documents/monfichier.pdf

// Route générique pour servir les fichiers de public/
app.get('/image/*filePath', (req, res, next) => {
    // req.params.filePath est un tableau de segments, ex. ['images','photo.jpg']
    const filePath = Array.isArray(req.params.filePath)
      ? req.params.filePath.join('/')
      : req.params.filePath;
  
    res.sendFile(filePath, { root: path.join(__dirname, '../public') }, err => {
      if (err) next(err);
    });
  });
  


app.use('/validation',validationRoutes); // gestion des codes de vérification par mail
app.use('/auth',authRoutes);
app.use('/praticien',profilPratiicienRoutes);

app.use(errorHandler);

module.exports = app;
