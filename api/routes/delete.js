const express = require("express");
const router = express.Router();

const User = require("../../models/models/User");

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
    await User.findByIdAndUpdate(
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

module.exports = router;
