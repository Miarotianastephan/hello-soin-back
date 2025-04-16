const express = require('express');
const cors = require('cors');

const errorHandler = require('./middlewares/errorHandler');
const authRoutes = require('./routes/auth/auth-praticien.routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

// Mise en place des routes
app.use('/auth',authRoutes);

app.use(errorHandler);

module.exports = app;
