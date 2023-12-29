const mongoose = require("mongoose");

const financeOutcomeSchema = new mongoose.Schema({
  status: {
    type: String,
  },
  quote: {
    type: String,
  },
  user: {
    type: String,
  },
  type: {
    type: String,
  },
  department: {
    type: String,
  },
  customer: {
    type: String,
  },
  customerType: {
    type: String,
  },
  items: {
    type: Array,
  },
  service: {
    type: String,
  },
  price: {
    type: Number,
  },
  finalPrice: {
    type: Number,
  },
  commissioned: {
    type: Boolean,
  },
  commission: {
    type: Object,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resolvedAt: {
    type: String,
  },
  payment: {
    type: Object,
  },
  paidAt: {
    type: String,
  },
  commentary: {
    type: String,
  },
  entry: {
    type: Object,
  },
});

const FinanceOutcome = mongoose.model("FinanceOutcome", financeOutcomeSchema);

module.exports = FinanceOutcome;
