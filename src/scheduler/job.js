const cron = require('node-cron');
const parseAndSave = require('../services/parser');
const pairs = require('../utils/config')

cron.schedule('*/2 * * * *', async () => {
  console.log('Запуск парсера...');
  for (const pair of pairs) {
    await parseAndSave(pair);
  }
});