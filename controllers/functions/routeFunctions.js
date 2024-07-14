const Customer = require("../../models/models/Customer");
const Client = require("../../models/models/Client");
const Job = require("../../models/models/Job");
const Sale = require("../../models/models/Sale");

function defineModel(model) {
  switch (model) {
    case "Customer":
      return Customer;
    case "Client":
      return Client;
    case "Job":
      return Job;
    case "Sale":
      return Sale;
    default:
      return null;
  }
}

module.exports = { defineModel };
