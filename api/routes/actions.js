const express = require("express");
const router = express.Router();
const { defineModel } = require("../../controllers/functions/routeFunctions");
const dayjs = require("dayjs");

// RESOLVE ITEM
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

module.exports = router;
