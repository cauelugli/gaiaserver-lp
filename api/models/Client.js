const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  addressHome: {
    type: String,
    required: true,
  },
  addressDelivery: {
    type: String,
  },
  addressBill: {
    type: String,
  },
  phone: {
    type: String,
    required: true,
  },
  cpf: {
    type: String,
    required: true,
  },
  birthdate: {
    type: Date,
  },
  gender: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  recentRequests: {
    type: Array,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;
