const express = require("express");
const router = express.Router();

const Admin = require("../../models/models/Admin");
const Config = require("../../models/models/Config");
const mainQueue = require("../../queues/mainQueue");

const { defineModel } = require("../../controllers/functions/routeFunctions");

// USER - MARK SINGLE NOTIFICATION AS READ - QUEUE OK
router.put("/markNotificationAsRead", async (req, res) => {
  const { userId, notificationCreatedAt, isAdmin } = req.body;
  try {
    mainQueue.add({
      type: "markAllNotificationAsRead",
      data: {
        userId,
        notificationCreatedAt,
        model: isAdmin ? "Admin" : "User",
      },
    });

    res.status(200).json("OK");
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar notificação" });
  }
});

// USER - DELETE SINGLE NOTIFICATION - QUEUE OK
router.put("/deleteNotification", async (req, res) => {
  // in the future, as a company, we will send this somewhere, instead of deleting
  const { userId, isAdmin, notificationCreatedAt } = req.body;
  try {
    mainQueue.add({
      type: "deleteNotification",
      data: {
        userId,
        notificationCreatedAt,
        model: isAdmin ? "Admin" : "User",
      },
    });

    res.status(200).json("OK");
  } catch (err) {
    res.status(500).json({ error: "Erro ao deletar notificação" });
  }
});

// USER - MARK ALL NOTIFICATIONS AS READ - QUEUE OK
router.put("/markAllAsRead", async (req, res) => {
  const { userId, isAdmin } = req.body;
  try {
    mainQueue.add({
      type: "markAllNotificationAsRead",
      data: {
        userId,
        model: isAdmin ? "Admin" : "User",
      },
    });

    res.status(200).json("OK");
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erro ao marcar todas notificações como lidas" });
  }
});

// REQUEST - RESOLVE ITEM - QUEUE OK
router.put("/resolve", async (req, res) => {
  const { model, id, resolution, resolvedBy } = req.body;
  const Model = defineModel(model);

  const resolvedItem = await Model.findById(id);

  if (!Model) {
    console.log("\nModel not found\n");
    return res.status(400).json({ error: "Modelo inválido" });
  }

  try {
    mainQueue.add({
      type: "resolveItem",
      data: {
        id,
        model,
        resolution,
        resolvedBy,
      },
    });

    if (model === "StockEntry") {
      mainQueue.add({
        type: "addFinanceOutcome",
        data: {
          resolvedItem,
          type: "Entrada de Estoque",
          createdBy: resolvedBy,
        },
      });

      // this step makes sense to be here
      mainQueue.add({
        type: "addToStock",
        data: { items: resolvedItem.items },
      });
    }

    if (model === "Sale" || model === "Job") {
      mainQueue.add({
        type: "addFinanceIncome",
        data: {
          resolvedItem,
          type: model === "Sale" ? "Venda" : "Job",
          createdBy: resolvedBy,
        },
      });
    }

    res.status(200).json({
      number: resolvedItem.number,
      title: resolvedItem.title,
      customer: resolvedItem.customer,
      resolution: resolvedItem.resolution,
    });
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

    res.status(200).json({
      number: targetItem.number,
      title: targetItem.title,
      customer: targetItem.customer,
    });
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
      // this step makes sense to be here
      // needs to remove 'materials' from service for case 'Job'
      case "Sale":
        mainQueue.add({
          type: "removeFromStock",
          data: { items: targetItem.products },
        });
        break;
      default:
        break;
    }

    res.status(200).json({
      number: targetItem.number,
      title: targetItem.title,
      customer: targetItem.customer,
    });
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

// UNIVERSAL - ARCHIVE ITEMS
router.put("/archiveItem", async (req, res) => {
  const { model, itemId, isUnarchive } = req.body;
  try {
    await mainQueue.add({
      type: "archiveItem",
      data: { model: model, itemId: itemId, isUnarchive: isUnarchive },
    });

    res.status(200).json("Item Arquivado com sucesso");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Erro ao arquivar item" });
  }
});

module.exports = router;
