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
    required: true,
  },
  quoteValue: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
  },
  type: {
    type: String,
  },
});

const StockEntry = mongoose.model("StockEntry", stockEntrySchema);

module.exports = StockEntry;
