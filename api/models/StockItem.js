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
    default: 1,
  },
  image: {
    type: String,
  },
  createdBy: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedBy: {
    type: String,
  },
  updatedAt: {
    type: Date,
  },
});

const StockItem = mongoose.model("StockItem", stockItemSchema);

module.exports = StockItem;
