const { mongoose } = require("../db");

userSchema = new mongoose.Schema({
  agenda: {
    type: Array,
    default: [],
  },
  birthdate: {
    type: String,
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
  isFirstAccess: {
    type: Boolean,
    default: true,
  },
  isManager: {
    type: Boolean,
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
  phone1: {
    type: String,
  },
  phone2: {
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
