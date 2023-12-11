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
  manager: {
    type: String,
  },
  customer: {
    type: String,
  },

  local: {
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
  createdBy: {
    type: String,
  },
  scheduledTo: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Quote = mongoose.model("Quote", quoteSchema);

module.exports = Quote;
