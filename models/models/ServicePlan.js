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
  period: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  priceDifference: {
    type: Object,
  },
  renewDay: {
    type: String,
    required: true,
  },
  services: {
    type: Object,
    required: true,
  },
  status: {
    type: String,
    default: "Aberto",
  },
});

const ServicePlan = mongoose.model("ServicePlan", servicePlanSchema);

module.exports = ServicePlan;
