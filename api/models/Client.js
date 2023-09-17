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
    required: true,
  },
  addressBill: {
    type: String,
    required: true,
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
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;
