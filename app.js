require('dotenv').config();
const express = require('express');

const mongoose = require('mongoose');

const cors = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes/index');

const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());
mongoose.connect('mongodb://127.0.0.1:27017/filmsdb');

app.use(cors);

app.use(requestLogger);

app.use(router);
app.use(errorLogger);
app.listen(PORT);