const mongoose = require("mongoose");

supportSchema = new mongoose.Schema({
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
  worker: {
    type: Object,
    required: true,
  },
  manager: {
    type: Object,
    required: true,
  },
  department: {
    type: Object,
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
  },
  service: {
    type: Object,
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
  local: {
    type: String,
  },
  scheduledTo: {
    type: String,
    required: true,
  },
  executedIn: {
    type: String,
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

const Support = mongoose.model("Support", supportSchema);

module.exports = Support;
