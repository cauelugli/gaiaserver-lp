const mongoose = require("mongoose");

const financeIncomeSchema = new mongoose.Schema({
  type: {
    type: String,
    default: 'income',
  },
  status: {
    type: String,
    default: 'Aberto',
  },
  quote: {
    type: String,
  },
  user: {
    type: String,
  },
  department: {
    type: String,
  },
  items: {
    type: Number,
    required: true,
  },
  price: {
    type: Array,
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
});

const FinanceIncome = mongoose.model("FinanceIncome", financeIncomeSchema);

module.exports = FinanceIncome;
