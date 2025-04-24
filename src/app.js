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
app.use(express.json());


// Mise en place des routes
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads'))); 
// exemple d'accès http://localhost:3000/uploads/documents/monfichier.pdf

app.use('/validation',validationRoutes); // gestion des codes de vérification par mail
app.use('/auth',authRoutes);
app.use('/praticien',profilPratiicienRoutes);

app.use(errorHandler);

module.exports = app;
