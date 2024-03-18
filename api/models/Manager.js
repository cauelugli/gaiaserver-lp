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
  agenda: {
    type: Array,
    default: [],
  },
  image: {
    type: String,
  },
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  role: {
    type: Object,
    default: {},
  },
  position: {
    type: Object,
    default: {},
  },
  notifications: {
    type: Object,
    default: { 0: "" },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  gender: {
    type: String,
  },
  birthdate: {
    type: Date,
  },
  groups: {
    type: Array,
  },
});

const Manager = mongoose.model("Manager", managerSchema);

module.exports = Manager;
