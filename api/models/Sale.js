const mongoose = require("mongoose");

saleSchema = new mongoose.Schema({
  customerId: {
    type: String,
    required: true,
  },
  requester: {
    type: String,
    required: true,
  },
  seller: {
    type: Object,
    required: true,
  },
  manager: {
    type: Object,
    required: true,
  },
  department: {
    type: Object,
    required: true,
  },
  status: {
    type: String,
  },
  price: {
    type: Number,
    default: 0,
    required: true,
  },
  cost: {
    type: Object,
  },
  deliveryScheduledTo: {
    type: String,
    required: true,
  },
  deliveryAddress: {
    type: String,
    required: true,
  },
  deliveredIn: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
  updatedBy: {
    type: String,
  },
});

const Sale = mongoose.model("Sale", saleSchema);

module.exports = Sale;
