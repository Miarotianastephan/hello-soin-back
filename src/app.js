const express = require('express');
const cors = require('cors');

const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

app.use(errorHandler);

module.exports = app;
