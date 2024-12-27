const express = require("express");
const router = express.Router();

const Admin = require("../../models/models/Admin");
const { defineModel } = require("../../controllers/functions/routeFunctions");
const {
  deleteRoutines,
} = require("../../controllers/functions/deleteRoutines");
const {
  notificationRoutines,
} = require("../../controllers/functions/notificationRoutines");
const {
  removeMembership,
} = require("../../controllers/functions/updateRoutines");

// DELETE ITEM
router.delete("/:sourceId/:model/:id", async (req, res) => {
  const { sourceId, model, id } = req.params;
  const Model = defineModel(model);

  if (!Model) {
    console.log("\nModel not found\n");
    return res.status(400).json({ error: "Modelo inválido" });
  }

  // defining if user is admin
  let isAdmin = false;
  try {
    const admin = await Admin.findOne();
    if (admin && admin._id.toString() === sourceId) {
      isAdmin = true;
    }
  } catch (err) {
    return res.status(500).json({ error: "Erro ao verificar admin" });
  }

  // you don't 'delete' an operator, you reset User's data to blank
  if (model === "Operator") {
    const operator = await Model.findById(id);
    const originalRole = operator.role;

    const deletedOperator = await Model.findByIdAndUpdate(
      id,
      { $set: { username: "", password: "", role: "", alreadyLogin: false } },
      { new: true }
    );

    await removeMembership(
      deletedOperator._id.toString(),
      "Role",
      originalRole
    );

    return res.status(200).json("Operador deletado com sucesso");
  }

  try {
    const deletedItem = await Model.findByIdAndDelete(id);
    await deleteRoutines(model, deletedItem, id);

    await notificationRoutines(
      model,
      deletedItem.name || deletedItem.title || deletedItem.number,
      "delete",
      sourceId,
      `${model.toLowerCase()}IsDeleted`,
      [],
      isAdmin
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

  // defining if user is admin
  let isAdmin = false;
  try {
    const admin = await Admin.findOne();
    if (admin && admin._id.toString() === sourceId) {
      isAdmin = true;
    }
  } catch (err) {
    return res.status(500).json({ error: "Erro ao verificar admin" });
  }

  if (!idArray || idArray.length === 0) {
    return res.status(400).json({ error: "Nenhum ID fornecido para deleção" });
  }

  try {
    for (const id of idArray) {
      if (model === "Operator") {
        const operator = await Model.findById(id);
        const originalRole = operator.role;

        const deletedOperator = await Model.findByIdAndUpdate(
          id,
          {
            $set: { username: "", password: "", role: "", alreadyLogin: false },
          },
          { new: true }
        );

        await removeMembership(
          deletedOperator._id.toString(),
          "Role",
          originalRole
        );

        return res.status(200).json("Operador deletado com sucesso");
      } else {
        const deletedItem = await Model.findByIdAndDelete(id);
        if (deletedItem) {
          await deleteRoutines(model, deletedItem, id);
          await notificationRoutines(
            model,
            deletedItem.title || deletedItem.name,
            "delete",
            sourceId,
            `${model.toLowerCase()}IsDeleted`,
            [],
            isAdmin
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
