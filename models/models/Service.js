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
    type: Object,
    required: true,
  },
  executionTime: {
    type: Number,
  },
  materials: {
    type: Array,
  },
  materialsCost: {
    type: Number,
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
});

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
