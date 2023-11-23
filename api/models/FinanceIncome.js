const mongoose = require("mongoose");

const financeIncomeSchema = new mongoose.Schema({
  status: {
    type: String,
    default: "Aberto",
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
  commissioned: {
    type: Boolean,
  },
  commission: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  scheduledTo: {
    type: Date,
  },
  executedAt: {
    type: Date,
  },
  resolvedAt: {
    type: Date,
  },
  payment: {
    type: Object,
  },
  paidAt: {
    type: Date,
  },
  commentary: {
    type: String,
  },
});

const FinanceIncome = mongoose.model("FinanceIncome", financeIncomeSchema);

module.exports = FinanceIncome;
