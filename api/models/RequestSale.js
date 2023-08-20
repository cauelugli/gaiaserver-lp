const mongoose = require("mongoose");

requestSaleSchema = new mongoose.Schema({
  customerId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "Venda",
  },
  requester: {
    type: String,
    required: true,
  },
  workerId: {
    type: String,
  },
  managerId: {
    type: String,
  },
  depatmentId: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    default: 0,
    required: true,
  },
  cost: {
    type: Object,
  },
  bill: {
    type: Object,
  },
  scheduledTo: {
    type: Date,
  },
  executedAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
  },
  updatedBy: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const RequestSale = mongoose.model("RequestSale", requestSaleSchema);

module.exports = RequestSale;
