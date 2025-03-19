const models = {
  Admin: require("../../models/models/Admin"),
  Client: require("../../models/models/Client"),
  Customer: require("../../models/models/Customer"),
  Department: require("../../models/models/Department"),
  FinanceIncome: require("../../models/models/FinanceIncome"),
  FinanceOutcome: require("../../models/models/FinanceOutcome"),
  Group: require("../../models/models/Group"),
  Job: require("../../models/models/Job"),
  Log: require("../../models/models/Log"),
  Notifications: require("../../models/models/Notifications"),
  Operator: require("../../models/models/User"),
  Position: require("../../models/models/Position"),
  Product: require("../../models/models/Product"),
  RecentActivity: require("../../models/models/RecentActivity"),
  Role: require("../../models/models/Role"),
  Sale: require("../../models/models/Sale"),
  Service: require("../../models/models/Service"),
  ServicePlan: require("../../models/models/ServicePlan"),
  StockEntry: require("../../models/models/StockEntry"),
  User: require("../../models/models/User"),
};

function defineModel(model) {
  return models[model] || null;
}
const parseReqFields = function (fields, reqBody, filteredCounter) {
  const result = {
    ...fields,
    manager: fields.manager?._id || reqBody.manager?._id || "",
    number: filteredCounter,
    members: (
      fields.members ||
      reqBody.members ||
      reqBody.selectedMembers ||
      []
    ).map((member) => member._id || member),
    position: fields.position || reqBody.position || "",
    role: fields.role?._id || reqBody.role?._id || "",
    selectedMembers: fields.selectedMembers || reqBody.selectedMembers || [],
    image: fields.image || reqBody.image || "",
    type:
      typeof fields.type === "string"
        ? fields.type
        : fields.type?.name?.toString() || "",
    isManager: fields.isManager || reqBody.isManager || false,
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

  if (reqBody.createdBy !== undefined) {
    result.createdBy = reqBody.createdBy;
  }

  return result;
};

module.exports = {
  defineModel,
  parseReqFields,
};
