const mongoose = require("mongoose");

const financeIncomeSchema = new mongoose.Schema({
  status: {
    type: String,
    default: "Aguardando Agendamento",
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
    type: Object,
  },
  createdAt: {
    type: Date,
    default: Date.now,
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
