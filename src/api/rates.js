const express = require('express');
const Rate = require('../models/Rate');

const router = express.Router();

router.get('/latest', async (req, res) => {
  try {
    const { from, to, side } = req.query;
    const rate = await Rate.findOne({ fromCurrency: from, toCurrency: to, side: side })
      .sort({ time: -1 })
      .exec();
    if (!rate) {
      return res.status(404).json({ message: 'Курс не найден' });
    }
    res.json(rate);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;