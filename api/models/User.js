const mongoose = require("mongoose");

userSchema = new mongoose.Schema({
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
  notifications: {
    type: Object,
    default: { 0: "" },
  },
  agenda: {
    type: Array,
    default: [],
  },
  groups: {
    type: Array,
  },
  position: {
    type: Object,
    default: {},
  },
  hasDarkModeActive: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  gender: {
    type: String,
  },
  birthdate: {
    type: Date,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
