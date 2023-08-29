const mongoose = require("mongoose");

const stockItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  sellValue: {
    type: Number,
    required: true,
  },
  buyValue: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const StockItem = mongoose.model("StockItem", stockItemSchema);

module.exports = StockItem;
