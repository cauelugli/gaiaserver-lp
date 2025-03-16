const { mongoose } = require("../db");

const productSchema = new mongoose.Schema({
  buyValue: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: String,
  },
  fields: {
    type: Array,
  },
  images: {
    type: Array,
  },
  name: {
    type: String,
  },
  sellValue: {
    type: Number,
  },
  stockQuantity: {
    type: Number,
    default: 0,
  },
  type: {
    type: String,
    required: true,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
