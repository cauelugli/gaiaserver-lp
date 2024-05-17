const { mongoose } = require("../db");

const servicePlanSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  name: {
    type: String,
    required: true,
  },
  services: {
    type: Object,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
});

const ServicePlan = mongoose.model("ServicePlan", servicePlanSchema);

module.exports = ServicePlan;
