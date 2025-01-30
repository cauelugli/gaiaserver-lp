const { mongoose } = require("../db");

departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
  },
  email: {
    type: String,
  },
  manager: {
    type: String,
  },
  members: {
    type: Array,
  },
  phone: {
    type: String,
  },
  positions: {
    type: Array,
    default: []
  },
  services: {
    type: Array,
  },
  status: {
    type: String,
    default: "Aberto",
  },
  type: {
    type: String,
    required: true,
  },
});

const Department = mongoose.model("Department", departmentSchema);

module.exports = Department;
