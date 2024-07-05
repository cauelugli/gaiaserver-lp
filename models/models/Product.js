const { mongoose } = require("../db");

const productSchema = new mongoose.Schema({
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
  type: {
    type: String,
    required: true,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
