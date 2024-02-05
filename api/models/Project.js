const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  creator: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  customer: {
    type: Object,
    required: true,
  },
  customerType: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  mainDepartment: {
    type: Object,
  },
  members: {
    type: Array,
  },
  departments: {
    type: Array,
  },
  price: {
    type: Array,
  },
  createdAt: {
    type: String,
  },
  dueTo: {
    type: String,
  },
  interactions: {
    type: Array,
  },
  stages: {
    type: Object,
  },
  attachments: {
    type: Object,
  },
  status: {
    type: String,
    default: "Aberto",
  },
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
