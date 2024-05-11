const mongoose = require("mongoose");

const financeOutcomeSchema = new mongoose.Schema({
  commission: {
    type: Object,
  },
  commissioned: {
    type: Boolean,
  },
  commentary: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  customer: {
    type: String,
  },
  customerType: {
    type: String,
  },
  entry: {
    type: Object,
  },
  finalPrice: {
    type: Number,
  },
  items: {
    type: Array,
  },
  paidAt: {
    type: String,
  },
  payment: {
    type: Object,
  },
  price: {
    type: Number,
  },
  quote: {
    type: String,
  },
  resolvedAt: {
    type: String,
  },
  service: {
    type: String,
  },
  status: {
    type: String,
  },
  type: {
    type: String,
  },
  user: {
    type: String,
  },
});

const FinanceOutcome = mongoose.model("FinanceOutcome", financeOutcomeSchema);

module.exports = FinanceOutcome;
