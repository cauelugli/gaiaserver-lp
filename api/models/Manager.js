const mongoose = require("mongoose");

managerSchema = new mongoose.Schema({
  customerId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  department: {
    type: Object,
  },
  avatarColor: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isAllocated: {
    type: Boolean,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Manager = mongoose.model("Manager", managerSchema);

module.exports = Manager;
