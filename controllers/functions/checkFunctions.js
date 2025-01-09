const Config = require("../../models/models/Config");

const { removeFromStock } = require("./deleteFunctions");

async function checkNewRequestDefaultStatus(fields, selectedProducts) {
  try {
    const config = await Config.findOne();

    if (config.requests.requestsNeedApproval === false) {
      fields.status = "Aprovado";
      if (selectedProducts && Array.isArray(selectedProducts)) {
        await removeFromStock(selectedProducts);
      }
    } else {
      fields.status = "Aberto";
    }
  } catch (err) {
    console.error("Erro ao verificar requestsNeedApproval", err);
    throw err;
  }
}

async function checkNewStockEntryDefaultStatus(fields) {
  try {
    const config = await Config.findOne();
    if (config.stock.stockEntriesNeedApproval === false) {
      fields.status = "Aprovado";
      if (fields.items && Array.isArray(fields.items)) {
        await addToStock(fields.items);
      }
    } else {
      fields.status = "Aberto";
    }
  } catch (err) {
    console.error("Erro ao verificar stockEntriesNeedApproval:", err);
    throw err;
  }
}

module.exports = {
  checkNewRequestDefaultStatus,
  checkNewStockEntryDefaultStatus,
};
