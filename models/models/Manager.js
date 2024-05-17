const { mongoose } = require("../db");

managerSchema = new mongoose.Schema({
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
  isFirstAccess: {
    type: Boolean,
    default: true,
  },
  isManager: {
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
    default: "",
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
    default: "",
  },
});

const Manager = mongoose.model("Manager", managerSchema);

module.exports = Manager;
