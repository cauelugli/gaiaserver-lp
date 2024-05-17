const { mongoose } = require("../db");

const projectSchema = new mongoose.Schema({
  attachments: {
    type: Array,
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
  customer: {
    type: Object,
    required: true,
  },
  customerType: {
    type: String,
    required: true,
  },
  definedStagesColors: {
    type: Array,
  },
  departments: {
    type: Array,
  },
  description: {
    type: String,
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
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
  },
  recurrent: {
    type: Boolean,
    default: false
  },
  stages: {
    type: Object,
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

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
