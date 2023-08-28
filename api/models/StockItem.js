const mongoose = require("mongoose");

const stockItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const StockItem = mongoose.model("StockItem", stockItemSchema);

module.exports = StockItem;
