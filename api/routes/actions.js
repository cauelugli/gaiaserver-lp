const express = require("express");
const router = express.Router();
const axios = require("axios");
const { defineModel } = require("../../controllers/functions/routeFunctions");
const dayjs = require("dayjs");
const Admin = require("../../models/models/Admin");
const Config = require("../../models/models/Config");
const {
  notifyApproverManager,
} = require("../../controllers/functions/notificationRoutines");

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

// REQUEST - REQUEST APPROVAL
router.put("/requestApproval", async (req, res) => {
  const { model, id, requestedBy } = req.body;
  const Model = defineModel(model);

  if (!Model) {
    console.log("\nModel not found\n");
    return res.status(400).json({ error: "Modelo inválido" });
  }

  try {
    const updatedItem = await Model.findByIdAndUpdate(
      id,
      {
        status: "Aprovação Solicitada",
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

    if (config.requests.requestsNeedApproval === true) {
      const { data: idIndexList } = await axios.get(
        "http://localhost:3000/api/idIndexList"
      );

      await notifyApproverManager(
        config.requests.requestsApproverManager,
        model,
        updatedItem.title || updatedItem.number,
        requestedBy,
        idIndexList
      );
    }

    res.status(200).json("Item resolvido com sucesso");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Erro ao resolver o item" });
  }
});

module.exports = router;
