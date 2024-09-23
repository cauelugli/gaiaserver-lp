const { mongoose } = require("../db");

const serviceSchema = new mongoose.Schema({
  color: {
    type: String,
    default: "#ffffff",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  department: {
    type: String,
    required: true,
  },
  executionTime: {
    type: String,
  },
  materials: {
    type: Array,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  sessions: {
    type: String,
  },
  type: {
    type: Object,
  },
});

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
