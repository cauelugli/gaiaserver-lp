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
  products: {
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
  status: {
    type: String,
    default: "Aberto",
  },
  type: {
    type: String,
  },
});

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
