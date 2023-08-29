const mongoose = require("mongoose");

const stockItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  sellValue: {
    type: String,
    required: true,
  },
  buyValue: {
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
