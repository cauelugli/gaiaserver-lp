const { mongoose } = require("../db");

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
  itemNumber: {
    type: Number,
  },
  itemId: {
    type: String,
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
  number: {
    type: Number,
  },
  quote: {
    type: String,
  },
  resolvedAt: {
    type: String,
  },
  status: {
    type: String,
    default: "Aberto",
  },
  typeOutcome: {
    type: String,
    required: true,
  },
});

const FinanceOutcome = mongoose.model("FinanceOutcome", financeOutcomeSchema);

module.exports = FinanceOutcome;
