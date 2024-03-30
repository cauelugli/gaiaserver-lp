const mongoose = require("mongoose");

userSchema = new mongoose.Schema({
  agenda: {
    type: Array,
    default: [],
  },
  birthdate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  department: {
    type: Object,
  },
  email: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
  },
  groups: {
    type: Array,
  },
  image: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  name: {
    type: String,
    required: true,
  },
  notifications: {
    type: Object,
    default: { 0: "" },
  },
  password: {
    type: String,
  },
  phone: {
    type: String,
  },
  position: {
    type: Object,
    default: {},
  },
  role: {
    type: Object,
    default: {},
  },
  username: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
