const { mongoose } = require("../db");

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
  products: {
    type: Array,
  },
  number: {
    type: Number,
  },
  deliveryReceiver: {
    type: String,
  },
  deliveryReceiverPhone: {
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
  version: {
    type: Number,
    default: 0,
  },
});

const Quote = mongoose.model("Quote", quoteSchema);

module.exports = Quote;
