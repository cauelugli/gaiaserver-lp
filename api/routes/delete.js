const express = require("express");
const router = express.Router();

const mainQueue = require("../../queues/mainQueue");

const { defineModel } = require("../../controllers/functions/routeFunctions");

// DELETE SINGLE ITEM
router.delete("/:sourceId/:model/:id", async (req, res) => {
  const { sourceId, model, id } = req.params;
  try {
    mainQueue.add({
      type: "deleteSingleItem",
      data: { sourceId: sourceId, model: model, id: id },
    });
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

  //this can go to defineModel
  if (!Model) {
    console.log("\nModel not found\n");
    return res.status(400).json({ error: "Modelo inválido" });
  }
  //

  if (!idArray || idArray.length === 0) {
    return res.status(400).json({ error: "Nenhum ID fornecido para deleção" });
  } else {
    try {
      mainQueue.add({
        type: "deleteMultipleItems",
        data: { sourceId: sourceId, model: model, ids: idArray },
      });
      res.status(200).json("Itens deletados com sucesso");
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Erro ao deletar os itens" });
    }
  }
});

module.exports = router;
