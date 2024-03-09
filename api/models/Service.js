const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  department: {
    type: Object,
    required: true,
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
  executionTime: {
    type: Number,
  }
});

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
