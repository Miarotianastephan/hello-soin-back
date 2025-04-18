const express = require('express');
const cors = require('cors');

const errorHandler = require('./middlewares/errorHandler');
const authRoutes = require('./routes/auth/auth-praticien.routes');
const validationRoutes = require('./routes/mail/validation.routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

// Mise en place des routes
app.use('/validation',validationRoutes); // gestion des codes de vérification par mail
app.use('/auth',authRoutes);

app.use(errorHandler);

module.exports = app;
