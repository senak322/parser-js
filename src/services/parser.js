const axios = require('axios');
const Rate = require('../models/Rate');

// Получение ордеров с Bybit
async function getOrders(currency, token, side, amount, paymentId) {
    const url = 'https://api2.bybit.com/fiat/otc/item/online';
  
    const payload = {
      tokenId: token,
      currencyId: currency,
      side: side,
      size: "10",
      amount: amount,
      payment: paymentId ? [paymentId] : [],
      page: "1",
      vaMaker: false,
      bulkMaker: false,
      canTrade: true,
      verificationFilter: 0,
      sortType: "TRADE_PRICE",
      paymentPeriod: [],
      itemRegion: 1
    };
  
    const { data } = await axios.post(url, payload, {
      headers: { 'Content-Type': 'application/json;charset=UTF-8' }
    });
  
    return data.result.items;
  }
  
  // Расчёт медианы
  function calculateMedian(prices) {
    prices.sort((a, b) => a - b);
    const n = prices.length;
    return n % 2 === 0
      ? (prices[n / 2 - 1] + prices[n / 2]) / 2
      : prices[Math.floor(n / 2)];
  }
  
  async function parseAndSave(pair) {
    try {
      const items = await getOrders(pair.from, pair.to, pair.side, pair.amount, pair.paymentId);
      if (!items.length) {
        console.log(`Нет данных для ${pair.from} -> ${pair.to}`);
        return;
      }
  
      const prices = items.slice(1, 10).map(item => parseFloat(item.price));
      const median = calculateMedian(prices);
  
      console.log(`Медианный курс ${pair.from} -> ${pair.to}: ${median}`);
  
      const rate = new Rate({
        fromCurrency: pair.from,
        toCurrency: pair.to,
        amount: pair.amount,
        paymentId: pair.paymentId,
        medianPrice: median,
        side: Number(pair.side)
      });
  
      await rate.save();
      console.log(`Курс ${pair.from} -> ${pair.to} сохранён в MongoDB`);
    } catch (error) {
      console.error('Ошибка:', error.message);
    }
  }


  module.exports = parseAndSave;
  