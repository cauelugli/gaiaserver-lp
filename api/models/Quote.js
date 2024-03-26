const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: String,
  },
  customer: {
    type: Object,
  },
  department: {
    type: String,
  },
  description: {
    type: String,
  },
  local: {
    type: String,
  },
  manager: {
    type: String,
  },
  materials: {
    type: Array,
  },
  materialsCost: {
    type: Number,
  },
  number: {
    type: String,
  },
  scheduledTo: {
    type: String,
  },
  service: {
    type: String,
  },
  serviceValue: {
    type: Number,
  },
  title: {
    type: String,
  },
  type: {
    type: String,
  },
  user: {
    type: String,
  },
  value: {
    type: Number,
  },
});

const Quote = mongoose.model("Quote", quoteSchema);

module.exports = Quote;
