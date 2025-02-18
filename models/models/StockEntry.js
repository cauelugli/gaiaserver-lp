const { mongoose } = require("../db");

const stockEntrySchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: String,
  },
  items: {
    type: Array,
    required: true,
  },
  number: {
    type: Number,
  },
  price: {
    type: Number,
    required: true,
  },
  requester: {
    type: String,
  },
  status: {
    type: String,
    default: "Aberto",
  },
});

const StockEntry = mongoose.model("StockEntry", stockEntrySchema);

module.exports = StockEntry;
