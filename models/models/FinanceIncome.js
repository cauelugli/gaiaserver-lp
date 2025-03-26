const { mongoose } = require("../db");

const financeIncomeSchema = new mongoose.Schema({
  commentary: {
    type: String,
  },
  commission: {
    type: Object,
  },
  commissioned: {
    type: Boolean,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  customer: {
    type: Object,
  },
  number: {
    type: Number,
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
  resolvedAt: {
    type: String,
  },
  service: {
    type: String,
  },
  status: {
    type: String,
    default: "Aberto",
  },
  user: {
    type: String,
  },
  typeIncome: {
    type: String,
  },
});

const FinanceIncome = mongoose.model("FinanceIncome", financeIncomeSchema);

module.exports = FinanceIncome;
