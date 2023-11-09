const mongoose = require("mongoose");

const servicePlanSchema = new mongoose.Schema({
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ServicePlan = mongoose.model("ServicePlan", servicePlanSchema);

module.exports = ServicePlan;
