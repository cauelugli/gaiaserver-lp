const Config = require("../../models/models/Config");

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

module.exports = {
  checkNewRequestDefaultStatus,
  checkNewStockEntryDefaultStatus,
};
