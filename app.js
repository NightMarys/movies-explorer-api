require('dotenv').config();
const express = require('express');

const mongoose = require('mongoose');

// const cors = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes/index');
const { MONGO_URL_DEV } = require('./utils/constants');

const { NODE_ENV, MONGO_URL } = process.env;

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
mongoose.connect(NODE_ENV === 'production' ? MONGO_URL : MONGO_URL_DEV);

app.use(requestLogger);

// app.use(cors);

app.use(router);
app.use(errorLogger);
app.listen(PORT);
