const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  mainContactName: {
    type: String,
  },
  mainContactEmail: {
    type: String,
  },
  mainContactPosition: {
    type: String,
  },
  segment: {
    type: String,
    required: true,
  },
  domain: {
    type: String,
  },
  employees: {
    type: String,
  },
  website: {
    type: String,
  },
  cnpj: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  recentRequests: {
    type: Array,
  },
});

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
