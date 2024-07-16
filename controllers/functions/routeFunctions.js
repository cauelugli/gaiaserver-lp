const models = {
  Customer: require("../../models/models/Customer"),
  Client: require("../../models/models/Client"),
  Department: require("../../models/models/Department"),
  FinanceIncome: require("../../models/models/FinanceIncome"),
  FinanceOutcome: require("../../models/models/FinanceOutcome"),
  Group: require("../../models/models/Group"),
  Job: require("../../models/models/Job"),
  Manager: require("../../models/models/Manager"),
  Operator: require("../../models/models/User"),
  Position: require("../../models/models/Position"),
  Project: require("../../models/models/Project"),
  Quote: require("../../models/models/Quote"),
  Role: require("../../models/models/Role"),
  Sale: require("../../models/models/Sale"),
  Service: require("../../models/models/Service"),
  ServicePlan: require("../../models/models/ServicePlan"),
  User: require("../../models/models/User"),
};

function defineModel(model) {
  return models[model] || null;
}

module.exports = { defineModel };
