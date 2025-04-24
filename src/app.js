const express = require('express');
const cors = require('cors');
const path = require('path');

const errorHandler = require('./middlewares/errorHandler');
const authRoutes = require('./routes/auth/auth-praticien.routes');
const validationRoutes = require('./routes/mail/validation.routes');
const profilRoute = require('./routes/profil-praticien/profil-praticien.routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Pour vos autres dossiers statiques
app.use('/uploads', express.static('uploads'));

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
  

// Vos autres routes
app.use('/validation', validationRoutes);
app.use('/auth', authRoutes);
app.use('/profile', profilRoute);

app.use(errorHandler);

module.exports = app;
