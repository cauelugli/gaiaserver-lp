const mongoose = require("mongoose");

requestJobSchema = new mongoose.Schema({
  customerId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "Job",
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
  procedure: {
    type: Object,
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
    type: Date,
    required: true,
  },
  executedIn: {
    type: Date,
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

const RequestJob = mongoose.model("RequestJob", requestJobSchema);

module.exports = RequestJob;
