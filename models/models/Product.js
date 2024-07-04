const { mongoose } = require("../db");

const productSchema = new mongoose.Schema({
  createdBy: {
    type: String,
  },
  fields: {
    type: Array,
  },
  image: {
    type: String,
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
