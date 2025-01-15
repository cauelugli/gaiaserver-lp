const Config = require("../../models/models/Config");
const { defineModel } = require("./routeFunctions");

async function checkNewRequestDefaultStatus(fields) {
  try {
    const config = await Config.findOne();
    if (config.requests.requestsNeedApproval === false) {
      fields.status = "Aprovado";
    } else {
      fields.status = "Aberto";
    }
  } catch (err) {
    console.error("Erro ao verificar checkNewRequestDefaultStatus");
    throw err;
  }
}

async function checkNewStockEntryDefaultStatus(fields) {
  try {
    const config = await Config.findOne();
    if (config.stock.stockEntriesNeedApproval === false) {
      fields.status = "Aprovado";
    } else {
      fields.status = "Aberto";
    }
  } catch (err) {
    console.error("Erro ao verificar checkNewStockEntryDefaultStatus");
    throw err;
  }
}

async function checkSameName(data) {
  try {
    const Model = defineModel(data.model);

    if (!Model) {
      console.log("\nModel not found\n");
      throw new Error("Modelo Inválido");
    }

    const existingName = await Model.findOne({ name: data.name });
    if (existingName) {
      throw new Error("Nome já cadastrado");
    }
  } catch (err) {
    //Nome já cadastrado
    throw err;
  }
}

module.exports = {
  checkNewRequestDefaultStatus,
  checkNewStockEntryDefaultStatus,
  checkSameName,
};
