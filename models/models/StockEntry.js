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
  quoteValue: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
  },
});

const StockEntry = mongoose.model("StockEntry", stockEntrySchema);

module.exports = StockEntry;
