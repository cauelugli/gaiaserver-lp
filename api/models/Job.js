const mongoose = require("mongoose");

jobSchema = new mongoose.Schema({
  customerId: {
    type: String,
    required: true,
  },
  requesterUserId: {
    type: String,
    required: true,
  },
  workerUserId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  type: {
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
    type: Number,
    default: 0,
    required: true,
  },
  profit: {
    type: Number,
    required: true,
  },
  scheduledDate: {
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

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
