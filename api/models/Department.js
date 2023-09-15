const mongoose = require("mongoose");

departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  manager: {
    type: Object,
    required: true,
  },
  members: {
    type: Array,
  },
  services: {
    type: Array,
  },
  color: {
    type: String,
  },
  isInternal: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Department = mongoose.model("Department", departmentSchema);

module.exports = Department;
