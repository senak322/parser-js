require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const rateRoutes = require('./api/rates');
require('./scheduler/job');
const pairs = require('./utils/config')
const parseAndSave = require('./services/parser')

const app = express();
const PORT = process.env.PORT || 3300;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api', rateRoutes);

for (const pair of pairs) {
   parseAndSave(pair);
}

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

