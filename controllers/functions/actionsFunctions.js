const Product = require("../../models/models/Product");
const { defineModel } = require("./routeFunctions");

async function addToStock(items) {
  try {
    for (const item of items) {
      const product = await Product.findById(item._id);
      if (product) {
        product.stockQuantity += item.count;
        await product.save();
      } else {
        console.warn(`Produto com _id ${item._id} não encontrado.`);
      }
    }
  } catch (err) {
    console.error("Erro ao adicionar itens ao estoque:", err);
    throw err;
  }
}

async function archiveItem(data) {
  const Model = defineModel(data.model);
  try {
    await Model.findByIdAndUpdate(
      data.itemId,
      {
        status: data.isUnarchive ? "Aberto" : "Arquivado",
      },
      { new: true }
    );
  } catch (err) {
    console.error("Erro ao arquivar item ou itens", err);
    throw err;
  }
}

async function removeFromStock(items) {
  try {
    for (const item of items) {
      const product = await Product.findById(item._id);
      if (product) {
        if (item.count > product.stockQuantity) {
          throw new Error("Itens indisponíveis em estoque");
        }
        product.stockQuantity -= item.count;
        await product.save();
      } else {
        console.warn(`Produto com _id ${item._id} não encontrado.`);
      }
    }
  } catch (err) {
    console.error("Erro ao remover itens do estoque:", err.message);
    throw err;
  }
}

async function resolveItem(data) {
  const Model = defineModel(data.model);
  try {
    await Model.findByIdAndUpdate(
      data.id,
      {
        status: "Resolvido",
        resolution: data.resolution || "",
        resolvedAt: new Date(),
      },
      { new: true }
    );
  } catch (err) {
    console.error("Erro ao solicitar aprovação:", err.message);
    throw err;
  }
}

async function markAllNotificationAsRead(data) {
  const Model = defineModel(data.model);
  try {
    await Model.findOneAndUpdate(
      {},
      {
        $set: { "notifications.$[].read": true },
      },
      { new: true }
    );
  } catch (err) {
    console.error("Erro ao marcar todas como lidas:", err.message);
    throw err;
  }
}

async function markNotificationAsRead(data) {
  const Model = defineModel(data.model);
  try {
    await Model.findOneAndUpdate(
      { "notifications.createdAt": data.notificationCreatedAt },
      {
        $set: { "notifications.$.read": true },
      },
      { new: true }
    );
  } catch (err) {
    console.error("Erro ao marcar todas como lidas:", err.message);
    throw err;
  }
}

async function deleteNotification(data) {
  const Model = defineModel(data.model);
  try {
    await Model.findOneAndUpdate(
      {},
      {
        $pull: { notifications: { createdAt: data.notificationCreatedAt } },
      },
      { new: true }
    );
  } catch (err) {
    console.error("Erro ao marcar todas como lidas:", err.message);
    throw err;
  }
}

module.exports = {
  addToStock,
  archiveItem,
  markAllNotificationAsRead,
  markNotificationAsRead,
  removeFromStock,
  resolveItem,
  deleteNotification,
};
