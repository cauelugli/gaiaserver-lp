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

async function approveRequest(data) {
  const Model = defineModel(data.model);
  try {
    await Model.findByIdAndUpdate(
      data.modelId,
      {
        status: "Aprovado",
      },
      { new: true }
    );
  } catch (err) {
    console.error("Erro ao aprovar solicitação:", err.message);
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

async function requestApproval(data) {
  const Model = defineModel(data.model);
  try {
    await Model.findByIdAndUpdate(
      data.modelId,
      {
        status: "Aprovação Solicitada",
        requester: data.requester,
        $push: {
          interactions: {
            activity: "Solicitação de Aprovação",
            attachments: [],
            date: new Date(),
            number: null,
            reactions: {
              dislike: { quantity: 0, usersReacted: [] },
              haha: { quantity: 0, usersReacted: [] },
              like: { quantity: 0, usersReacted: [] },
              love: { quantity: 0, usersReacted: [] },
            },
            user: data.requester,
          },
        },
      },
      { new: true }
    );
  } catch (err) {
    console.error("Erro ao solicitar aprovação:", err.message);
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
        resolvedBy: data.resolvedBy,
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
    switch (data.model) {
      case "Admin":
        await Model.findOneAndUpdate(
          {},
          {
            $set: { "notifications.$[].read": true },
          },
          { new: true }
        );
        break;
      case "User":
        await Model.findByIdAndUpdate(
          data.userId,
          {
            $set: { "notifications.$[].read": true },
          },
          { new: true }
        );
        break;
      default:
        "";
    }
  } catch (err) {
    console.error("Erro ao marcar todas como lidas:", err.message);
    throw err;
  }
}

async function markNotificationAsRead(data) {
  const Model = defineModel(data.model);
  try {
    switch (data.model) {
      case "Admin":
        await Model.findOneAndUpdate(
          { "notifications.createdAt": data.notificationCreatedAt },
          {
            $set: { "notifications.$.read": true },
          },
          { new: true }
        );
        break;
      case "User":
        await Model.findOneAndUpdate(
          {
            _id: data.userId,
            "notifications.createdAt": data.notificationCreatedAt,
          },
          {
            $set: { "notifications.$.read": true },
          },
          { new: true }
        );
        break;
      default:
        "";
    }
  } catch (err) {
    console.error("Erro ao marcar todas como lidas:", err.message);
    throw err;
  }
}

async function deleteNotification(data) {
  const Model = defineModel(data.model);
  try {
    switch (data.model) {
      case "Admin":
        await Model.findOneAndUpdate(
          {},
          {
            $pull: { notifications: { createdAt: data.notificationCreatedAt } },
          },
          { new: true }
        );
        break;
      case "User":
        await Model.findOneAndUpdate(
          { _id: data.userId },
          {
            $pull: { notifications: { createdAt: data.notificationCreatedAt } },
          },
          { new: true }
        );
        break;
      default:
        "";
    }
  } catch (err) {
    console.error("Erro ao marcar todas como lidas:", err.message);
    throw err;
  }
}

module.exports = {
  addToStock,
  approveRequest,
  archiveItem,
  markAllNotificationAsRead,
  markNotificationAsRead,
  removeFromStock,
  requestApproval,
  resolveItem,
  deleteNotification,
};
