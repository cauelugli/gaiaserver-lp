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
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  avatarColor: {
    type: String,
  },
  position: {
    type: String,
    default: "Colaborador",
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
