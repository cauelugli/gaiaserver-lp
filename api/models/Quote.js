const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema({
  number: {
    type: String,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  department: {
    type: String,
  },
  service: {
    type: String,
  },
  type: {
    type: String,
  },
  user: {
    type: String,
  },
  customer: {
    type: String,
  },
  value: {
    type: Number,
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
