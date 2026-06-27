const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const notFound = require('./errors/notFound');
const errorHandler = require('./errors/errorHandler');

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

app.get('/', (_req, res) => {
  res.json({ status: true, message: 'Student Management API is running' });
});

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
