const express = require("express");
const router = express.Router();
const { defineModel } = require("../../controllers/functions/routeFunctions");
const dayjs = require("dayjs");

// 'usesWebsocket' is not in use so far, lets make websocket work on the backend with only one call from the frontend

// RESOLVE ITEM
router.put("/resolve", async (req, res) => {
  const { model, id, resolvedBy, resolvedAt, usesWebsocket } = req.body;
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

// REQUEST APPROVAL
router.put("/requestApproval", async (req, res) => {
  const { model, id, requestedBy, requestedAt, usesWebsocket } = req.body;
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
            date: requestedAt || dayjs().format("DD/MM/YYYY HH:mm"),
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

    res.status(200).json("Item resolvido com sucesso");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Erro ao resolver o item" });
  }
});

module.exports = router;
