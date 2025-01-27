const express = require("express");
const router = express.Router();

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
  const { model, id, resolution, resolvedBy } = req.body;
  const Model = defineModel(model);

  if (!Model) {
    console.log("\nModel not found\n");
    return res.status(400).json({ error: "Modelo inválido" });
  }

  try {
    //QUEUE: resolveItem
    const updatedItem = await Model.findByIdAndUpdate(
      id,
      {
        status: "Resolvido",
        resolution,
        resolvedBy,
        resolvedAt: new Date(),
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

// REQUEST/STOCK - REQUEST APPROVAL - QUEUE OK
router.put("/requestApproval", async (req, res) => {
  const { model, id, requestedBy } = req.body;
  const Model = defineModel(model);
  const admin = await Admin.findOne({}, "config");

  if (!Model) {
    console.log("\nModel not found\n");
    return res.status(400).json({ error: "Modelo inválido" });
  }

  try {
    const targetItem = await Model.findById(id);

    if (!targetItem) {
      return res.status(404).json({ error: "Item não encontrado" });
    }

    mainQueue.add({
      type: "requestApproval",
      data: {
        requester: requestedBy,
        item: targetItem.title || targetItem.number,
        model: model,
        modelId: id,
      },
    });

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
          model: req.body.model,
          item: targetItem.title || targetItem.number,
          requestedBy: req.body.requestedBy,
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

// REQUEST/STOCK - MANAGER REQUEST APPROVAL - QUEUE OK
router.put("/approveRequest", async (req, res) => {
  const { model, id, approvedBy } = req.body;
  const Model = defineModel(model);

  if (!Model) {
    console.log("\nModel not found\n");
    return res.status(400).json({ error: "Modelo inválido" });
  }

  try {
    const targetItem = await Model.findById(id);

    if (!targetItem) {
      return res.status(404).json({ error: "Item não encontrado" });
    }

    mainQueue.add({
      type: "approveRequest",
      data: {
        target: targetItem.title || targetItem.number,
        manager: approvedBy,
        model: model,
        modelId: id,
      },
    });

    mainQueue.add({
      type: "notifyRequester",
      data: {
        target: targetItem.title || targetItem.number,
        manager: approvedBy,
        model: model,
        modelId: id,
        receiver: targetItem.requester,
      },
    });
    switch (model) {
      case "Sale":
        mainQueue.add({
          type: "removeFromStock",
          data: { items: targetItem.products },
        });
        break;
      case "StockEntry":
        mainQueue.add({
          type: "addToStock",
          data: { items: targetItem.items },
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

// STOCK - REQUEST PRODUCT BUY - QUEUE OK
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
          receiver: config.stock.stockEntriesApproverManager,
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
