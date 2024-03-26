const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

autoIncrement.initialize(mongoose.connection);

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

stockEntrySchema.plugin(autoIncrement.plugin, {
  model: "StockEntry",
  field: "number",
  startAt: 1,
  incrementBy: 1,
});

const StockEntry = mongoose.model("StockEntry", stockEntrySchema);

module.exports = StockEntry;
