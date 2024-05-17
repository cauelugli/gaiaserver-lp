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
    type: Date,
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
    default: "/images/default_userPicture.png",
  },
  isActive: {
    type: Boolean,
    default: true,
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
});

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;
