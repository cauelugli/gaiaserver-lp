const express = require("express");
const router = express.Router();

const { defineModel } = require("../../controllers/functions/routeFunctions");

const {
  deleteRoutines,
} = require("../../controllers/functions/deleteRoutines");

const {
  notificationRoutines,
} = require("../../controllers/functions/notificationRoutines");

// DELETE ITEM
router.delete("/:sourceId/:model/:id", async (req, res) => {
  const { sourceId, model, id } = req.params;
  const Model = defineModel(model);

  if (!Model) {
    console.log("\nModel not found\n");
    return res.status(400).json({ error: "Modelo inválido" });
  }

  // you don't 'delete' an operator, you reset User's data to blank
  if (model === "Operator") {
    await Model["User"].findByIdAndUpdate(
      id,
      { $set: { username: "", password: "", role: "", isFirstAccess: true } },
      { new: true }
    );
    return res.status(200).json("Item deletado com sucesso");
  }

  try {
    const deletedItem = await Model.findByIdAndDelete(id);
    await deleteRoutines(model, id);

    await notificationRoutines(
      model,
      deletedItem.name,
      "delete",
      sourceId,
      `${model.toLowerCase()}IsDeleted`
    );
    res.status(200).json("Item deletado com sucesso");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Erro ao deletar o item" });
  }
});

// DELETE MULTIPLE ITEMS
router.delete("/multiple/:sourceId/:model/:ids", async (req, res) => {
  const { sourceId, model, ids } = req.params;
  const idArray = ids.split(",");
  const Model = defineModel(model);

  if (!Model) {
    console.log("\nModel not found\n");
    return res.status(400).json({ error: "Modelo inválido" });
  }

  if (!idArray || idArray.length === 0) {
    return res.status(400).json({ error: "Nenhum ID fornecido para deleção" });
  }

  try {
    for (const id of idArray) {
      if (model === "Operator") {
        await Model["User"].findByIdAndUpdate(
          id,
          {
            $set: { username: "", password: "", role: "", isFirstAccess: true },
          },
          { new: true }
        );
      } else {
        const deletedItem = await Model.findByIdAndDelete(id);
        if (deletedItem) {
          await deleteRoutines(model, id);
          await notificationRoutines(
            model,
            deletedItem.name,
            "delete",
            sourceId,
            `${model.toLowerCase()}IsDeleted`
          );
        }
      }
    }

    res.status(200).json("Itens deletados com sucesso");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Erro ao deletar os itens" });
  }
});

module.exports = router;
