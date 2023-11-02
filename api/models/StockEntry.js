const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

autoIncrement.initialize(mongoose.connection);

const stockEntrySchema = new mongoose.Schema({
  items: {
    type: Array,
    required: true,
  },
  quoteValue: {
    type: Number,
    required: true,
  },
  createdBy: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
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
