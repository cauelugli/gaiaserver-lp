const mongoose = require("mongoose");

departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  manager: {
    type: Object,
  },
  members: {
    type: Array,
  },
  phone: {
    type: String,
    required: true,
  },
  positions: {
    type: Array,
    default: []
  },
  services: {
    type: Array,
  },
  type: {
    type: String,
    required: true,
  },
});

const Department = mongoose.model("Department", departmentSchema);

module.exports = Department;
