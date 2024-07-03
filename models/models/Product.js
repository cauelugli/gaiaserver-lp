const { mongoose } = require("../db");

const productSchema = new mongoose.Schema({
  fields: {
    type: Array,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
