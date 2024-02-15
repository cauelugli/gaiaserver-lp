const mongoose = require("mongoose");

const projectTemplateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  creator: {
    type: Object,
    required: true,
  },
  type: {
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
    type: Number,
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
  definedStagesColors: {
    type: Array,
  },
});

const ProjectTemplate = mongoose.model("ProjectTemplate", projectTemplateSchema);

module.exports = ProjectTemplate;
