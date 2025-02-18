const mongoose = require('mongoose');

const countersSchema = new mongoose.Schema({
  job: { type: Number },
  sale: { type: Number },
  stockEntry: { type: Number },
  financeIncome: { type: Number },
  financeOutcome: { type: Number },
});

const Counters = mongoose.model('Counters', countersSchema);

module.exports = Counters;
