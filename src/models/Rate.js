const mongoose = require('mongoose');

const RateSchema = new mongoose.Schema({
  fromCurrency: String,
  toCurrency: String,
  amount: String,
  paymentId: String,
  medianPrice: Number,
  side: Number,
  time: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Rate', RateSchema);