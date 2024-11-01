const express = require("express");
const router = express.Router();
const { defineModel } = require("../../controllers/functions/routeFunctions");

// console.log("\n don't try this at home \n");
// if (model === "Unexisting_Model_in_Database") {
//   const newItem = new Model();
//   const savedItem = await newItem.save();
//   console.log("savedItem", savedItem);
// }

// GET ALL ITEMS BASED ON MODEL PARAMETER
router.get("/", async (req, res) => {
  const { model } = req.query;
  const Model = defineModel(model);

  if (!Model) {
    console.log(`\nmodel ${model} not found\n`);
    return res.status(404).json({ error: "Model not found" });
  }

  try {
    let data = await Model.find();
    res.status(200).json(data);
  } catch (err) {
    console.log("\nerr", err, "\n");
    res.status(500).json(err);
  }
});

// GET USER'S NOTIFICATIONS
router.get("/notifications/:userId", async (req, res) => {
  const { userId } = req.params;
  const Model = defineModel("User");

  try {
    // Encontra o usuário e retorna apenas a lista de notificações
    const user = await Model.findById(userId, "notifications");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user.notifications);
  } catch (err) {
    console.log("\nerr", err, "\n");
    res.status(500).json(err);
  }
});

module.exports = router;
