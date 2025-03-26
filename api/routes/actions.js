const express = require("express");
const router = express.Router();

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
        model: "Admin",
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
        model: "Admin",
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
        model: "Admin",
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
  const { model, id, resolution } = req.body;
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
      },
    });

    if (model === "StockEntry") {
      mainQueue.add({
        type: "addFinanceOutcome",
        data: {
          resolvedItem,
          type: "Entrada de Estoque",
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
