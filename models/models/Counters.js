const mongoose = require("mongoose");

const countersSchema = new mongoose.Schema({
  job: { type: Number, default: 0 },
  sale: { type: Number, default: 0 },
  stockEntry: { type: Number, default: 0 },
  financeIncome: { type: Number, default: 0 },
  financeOutcome: { type: Number, default: 0 },
});

const Counters = mongoose.model("Counters", countersSchema);

module.exports = Counters;
