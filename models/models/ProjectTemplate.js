const { mongoose } = require("../db");

const projectTemplateSchema = new mongoose.Schema({
  attachments: {
    type: Object,
  },
  createdAt: {
    type: String,
  },
  creator: {
    type: Object,
    required: true,
  },
  currentStage: {
    type: Number,
    default: 0
  },
  departments: {
    type: Array,
  },
  description: {
    type: String,
  },
  definedStagesColors: {
    type: Array,
  },
  dueTo: {
    type: String,
  },
  interactions: {
    type: Array,
  },
  mainDepartment: {
    type: Object,
  },
  members: {
    type: Array,
  },
  price: {
    type: Number,
  },
  stages: {
    type: Object,
  },
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

const ProjectTemplate = mongoose.model("ProjectTemplate", projectTemplateSchema);

module.exports = ProjectTemplate;
