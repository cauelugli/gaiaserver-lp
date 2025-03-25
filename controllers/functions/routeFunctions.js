const models = {
  Admin: require("../../models/models/Admin"),
  Client: require("../../models/models/Client"),
  Customer: require("../../models/models/Customer"),
  FinanceIncome: require("../../models/models/FinanceIncome"),
  FinanceOutcome: require("../../models/models/FinanceOutcome"),
  Job: require("../../models/models/Job"),
  Log: require("../../models/models/Log"),
  Notifications: require("../../models/models/Notifications"),
  Product: require("../../models/models/Product"),
  RecentActivity: require("../../models/models/RecentActivity"),
  Sale: require("../../models/models/Sale"),
  Service: require("../../models/models/Service"),
  ServicePlan: require("../../models/models/ServicePlan"),
  StockEntry: require("../../models/models/StockEntry"),
};

function defineModel(model) {
  return models[model] || null;
}
const parseReqFields = function (fields, reqBody, filteredCounter) {
  const result = {
    ...fields,
    number: filteredCounter,
    image: fields.image || reqBody.image || "",
    type:
      typeof fields.type === "string"
        ? fields.type
        : fields.type?.name?.toString() || "",
    products: fields.selectedProducts || reqBody.selectedProducts || [],
    price:
      fields.label === "Plano de Serviços"
        ? parseFloat(
            fields.finalPrice === 0 ? fields.price : fields.finalPrice
          ) ||
          parseFloat(
            reqBody.finalPrice === 0 ? reqBody.price : reqBody.finalPrice
          ) ||
          0
        : parseFloat(fields.price) || parseFloat(reqBody.price) || 0,
    services: fields.services || reqBody.services || [],
  };

  if (reqBody.model === "Product" && Array.isArray(reqBody.fields)) {
    reqBody.fields.forEach((field) => {
      result[field.name] = field.value || "";
    });
  }
  return result;
};

module.exports = {
  defineModel,
  parseReqFields,
};
