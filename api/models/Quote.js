const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  user: {
    type: String,
  },
  customer: {
    type: String,
  },
  value: {
    type: Number,
    required: true,
  },
  materials: {
    type: Array,
  },
  materialsCost: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Quote = mongoose.model("Quote", quoteSchema);

module.exports = Quote;
