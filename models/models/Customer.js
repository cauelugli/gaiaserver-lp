const { mongoose } = require("../db");

const customerSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
  },
  cnpj: {
    type: String,
    required: true,
  },
  companyType: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  domain: {
    type: String,
  },
  employees: {
    type: String,
  },
  image: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  mainContactEmail: {
    type: String,
  },
  mainContactName: {
    type: String,
  },
  mainContactPhone: {
    type: String,
  },
  mainContactPosition: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  recentRequests: {
    type: Array,
  },
  segment: {
    type: String,
  },
  status: {
    type: String,
    default: "Aberto",
  },
  website: {
    type: String,
  },
});

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
