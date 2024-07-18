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
  price: {
    type: Number,
    required: true,
  },
  services: {
    type: Object,
    required: true,
  },
});

const ServicePlan = mongoose.model("ServicePlan", servicePlanSchema);

module.exports = ServicePlan;
