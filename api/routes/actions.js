const express = require("express");
const router = express.Router();
const dayjs = require("dayjs");

const Admin = require("../../models/models/Admin");
const Config = require("../../models/models/Config");
const mainQueue = require("../../queues/mainQueue");

const { defineModel } = require("../../controllers/functions/routeFunctions");

// USER - MARK SINGLE NOTIFICATION AS READ
router.put("/markNotificationAsRead", async (req, res) => {
  const { userId, notificationCreatedAt, isAdmin } = req.body;
  if (isAdmin) {
    try {
      await Admin.findOneAndUpdate(
        { "notifications.createdAt": notificationCreatedAt },
        {
          $set: { "notifications.$.read": true },
        },
        { new: true }
      );

      res.status(200).json("OK");
    } catch (err) {
      res.status(500).json({ error: "Erro ao atualizar notificação" });
    }
  } else {
    const Model = defineModel("User");

    if (!Model) {
      console.log("\nModel not found\n");
      return res.status(400).json({ error: "Modelo inválido" });
    }

    try {
      const updatedUser = await Model.findOneAndUpdate(
        { _id: userId, "notifications.createdAt": notificationCreatedAt },
        {
          $set: { "notifications.$.read": true },
        },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ error: "Notificação não encontrada" });
      }

      res.status(200).json("OK");
    } catch (err) {
      res.status(500).json({ error: "Erro ao atualizar notificação" });
    }
  }
});

// USER - DELETE SINGLE NOTIFICATION
router.put("/deleteNotification", async (req, res) => {
  // in the future, as a company, we will send this somewhere, instead of deleting
  const { userId, isAdmin, notificationCreatedAt } = req.body;
  if (isAdmin) {
    try {
      await Admin.findOneAndUpdate(
        {},
        {
          $pull: { notifications: { createdAt: notificationCreatedAt } },
        },
        { new: true }
      );
      res.status(200).json("OK");
    } catch (err) {
      res.status(500).json({ error: "Erro ao deletar notificação" });
    }
  } else {
    const Model = defineModel("User");

    if (!Model) {
      console.log("\nModel not found\n");
      return res.status(400).json({ error: "Modelo inválido" });
    }

    try {
      const updatedUser = await Model.findOneAndUpdate(
        { _id: userId },
        {
          $pull: { notifications: { createdAt: notificationCreatedAt } },
        },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ error: "Notificação não encontrada" });
      }

      res.status(200).json("OK");
    } catch (err) {
      res.status(500).json({ error: "Erro ao deletar notificação" });
    }
  }
});

// USER - MARK ALL NOTIFICATIONS AS READ
router.put("/markAllAsRead", async (req, res) => {
  const { userId, isAdmin } = req.body;
  if (isAdmin) {
    try {
      await Admin.findOneAndUpdate(
        {},
        {
          $set: { "notifications.$[].read": true },
        },
        { new: true }
      );

      res.status(200).json("OK");
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erro ao marcar todas notificações como lidas" });
    }
  } else {
    const Model = defineModel("User");

    if (!Model) {
      console.log("\nModel not found\n");
      return res.status(400).json({ error: "Modelo inválido" });
    }

    try {
      const updatedUser = await Model.findByIdAndUpdate(
        userId,
        {
          $set: { "notifications.$[].read": true },
        },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ error: "Notificação não encontrada" });
      }

      res.status(200).json("OK");
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erro ao marcar todas notificações como lidas" });
    }
  }
});

// REQUEST - RESOLVE ITEM
router.put("/resolve", async (req, res) => {
  const { model, id, resolvedBy, resolvedAt } = req.body;
  const Model = defineModel(model);

  if (!Model) {
    console.log("\nModel not found\n");
    return res.status(400).json({ error: "Modelo inválido" });
  }

  try {
    const updatedItem = await Model.findByIdAndUpdate(
      id,
      {
        status: "Resolvido",
        resolvedBy,
        resolvedAt: resolvedAt || dayjs().format("DD/MM/YYYY HH:mm"),
      },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ error: "Item não encontrado" });
    }

    res.status(200).json("Item resolvido com sucesso");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Erro ao resolver o item" });
  }
});

// REQUEST/STOCK - REQUEST APPROVAL
router.put("/requestApproval", async (req, res) => {
  const { model, id, requestedBy } = req.body;
  const Model = defineModel(model);
  const admin = await Admin.findOne({}, "config");

  if (!Model) {
    console.log("\nModel not found\n");
    return res.status(400).json({ error: "Modelo inválido" });
  }

  try {
    const updatedItem = await Model.findByIdAndUpdate(
      id,
      {
        status: "Aprovação Solicitada",
        requester: requestedBy,
        $push: {
          interactions: {
            activity: "Solicitação de Aprovação",
            attachments: [],
            date: dayjs().format("DD/MM/YYYY HH:mm"),
            number: null,
            reactions: {
              dislike: { quantity: 0, usersReacted: [] },
              haha: { quantity: 0, usersReacted: [] },
              like: { quantity: 0, usersReacted: [] },
              love: { quantity: 0, usersReacted: [] },
            },
            user: requestedBy,
          },
        },
      },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ error: "Item não encontrado" });
    }

    const config = await Config.findOne();

    const formattedModel = model === "StockEntry" ? "stock" : "requests";
    const formattedModelOption =
      model === "StockEntry"
        ? "stockEntriesNeedApproval"
        : "requestsNeedApproval";

    if (config[formattedModel][formattedModelOption] === true) {
      mainQueue.add({
        type: "notifyApproverManager",
        data: {
          requestsApproverManager: config.requests.requestsApproverManager,
          model: model,
          item: updatedItem.title || updatedItem.number,
          requestedBy: requestedBy,
        },
        isAdmin: requestedBy === admin._id.toString(),
      });
    }

    res.status(200).json("Item resolvido com sucesso");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Erro ao resolver o item" });
  }
});

// REQUEST/STOCK - MANAGER REQUEST APPROVAL
router.put("/approveRequest", async (req, res) => {
  const { model, id, approvedBy } = req.body;
  const Model = defineModel(model);

  if (!Model) {
    console.log("\nModel not found\n");
    return res.status(400).json({ error: "Modelo inválido" });
  }

  try {
    const updatedItem = await Model.findByIdAndUpdate(
      id,
      {
        status: "Aprovado",
      },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ error: "Item não encontrado" });
    }

    mainQueue.add({
      type: "notifyRequester",
      data: {
        target: updatedItem.title || updatedItem.number,
        manager: approvedBy,
        model: model,
        receiver: updatedItem.requester,
      },
    });
    switch (model) {
      case "Sale":
        mainQueue.add({
          type: "removeFromStock",
          data: { items: updatedItem.products },
        });
        break;
      case "StockEntry":
        mainQueue.add({
          type: "addToStock",
          data: { items: updatedItem.items },
        });
        break;
      default:
        break;
    }

    res.status(200).json("Item aprovado com sucesso");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Erro ao aprovar o item" });
  }
});

// STOCK - REQUEST PRODUCT BUY
router.put("/requestBuy", async (req, res) => {
  const { product, requestedBy } = req.body;
  try {
    const config = await Config.findOne();
    const admin = await Admin.findOne({}, "config");

    if (config.stock.stockEntriesNeedApproval === true) {
      // else notify admin?
      mainQueue.add({
        type: "notifyStockManagerToBuyProduct",
        data: {
          receiver: config.stock.stockEntriesDispatcherManager,
          requester: requestedBy || "",
          product,
        },
        isAdmin: requestedBy === admin._id.toString(),
      });
    }

    res
      .status(200)
      .json("Solicitação de Compra de Produto enviada com sucesso");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Erro ao solicitar compra do produto" });
  }
});

module.exports = router;
