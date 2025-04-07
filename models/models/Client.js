const { mongoose } = require("../db");

const clientSchema = new mongoose.Schema({
  addressBill: {
    type: String,
  },
  addressDelivery: {
    type: String,
  },
  addressHome: {
    type: String,
    required: true,
  },
  birthdate: {
    type: String,
  },
  cellphone: {
    type: String,
    required: true,
  },
  cpf: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  email: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
  },
  image: {
    type: String,
    default: "/default_userPicture.png",
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  status: {
    type: String,
    default: "Aberto",
  },
});

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;
