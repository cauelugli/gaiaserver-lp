const mongoose = require("mongoose");

departmentSchema = new mongoose.Schema({
  customerId: {
    type: String,
    required: true,
  },
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
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Department = mongoose.model("Department", departmentSchema);

module.exports = Department;
