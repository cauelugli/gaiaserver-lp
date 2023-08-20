const mongoose = require("mongoose");

requestSupportSchema = new mongoose.Schema({
  customerId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "Suporte",
  },
  requester: {
    type: String,
    required: true,
  },
  workerId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    default: 0,
    required: true,
  },
  cost: {
    type: Object,
  },
  scheduledTo: {
    type: Date,
  },
  executedIn: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
  updatedBy: {
    type: String,
  },
});

const RequestSupport = mongoose.model("RequestSupport", requestSupportSchema);

module.exports = RequestSupport;
