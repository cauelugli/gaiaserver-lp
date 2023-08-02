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
  users: {
    type: Array,
  },
  assets: {
    type: Array,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
