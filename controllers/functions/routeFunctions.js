const Customer = require("../../models/models/Customer");
const Client = require("../../models/models/Client");

function defineModel(model) {
  switch (model) {
    case "Cliente Empresa":
      return Customer;
    case "Cliente Pessoa Física":
      return Client;
    default:
      return null;
  }
}

module.exports = { defineModel };
