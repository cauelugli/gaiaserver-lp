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
    type: String,
    required: true,
  },
  materials: {
    type: Object,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
