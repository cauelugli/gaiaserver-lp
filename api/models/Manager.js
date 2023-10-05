const mongoose = require("mongoose");

managerSchema = new mongoose.Schema({
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
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  avatarColor: {
    type: String,
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

const Manager = mongoose.model("Manager", managerSchema);

module.exports = Manager;
