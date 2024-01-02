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
  position: {
    type: String,
    default: "-",
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

const User = mongoose.model("User", userSchema);

module.exports = User;
