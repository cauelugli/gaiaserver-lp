const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  color: {
    type: String,
    default: "#ffffff",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  department: {
    type: Object,
    required: true,
  },
  executionTime: {
    type: Number,
  },
  materials: {
    type: Array,
  },
  materialsCost: {
    type: Number,
  },
  name: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
});

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
