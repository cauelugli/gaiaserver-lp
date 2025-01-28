const express = require("express");
const router = express.Router();
const { defineModel } = require("../../controllers/functions/routeFunctions");
const { translateModel } = require("../../controllers/notificationOptions");

// console.log("\n don't try this at home \n");
// if (model === "Unexisting_Model_in_Database") {
//   const newItem = new Model();
//   const savedItem = await newItem.save();
//   console.log("savedItem", savedItem);
// }

// GET ALL ITEMS BASED ON MODEL PARAMETER
router.get("/", async (req, res) => {
  const { model, userId } = req.query;
  const Model = defineModel(model);

  if (!Model) {
    console.log(`\nmodel ${model} not found\n`);
    return res.status(404).json({ error: "Model not found" });
  }

  try {
    let data;
    if (model === "Agenda") {
      data = await Model.aggregate([
        {
          $project: {
            users: {
              $filter: {
                input: "$users",
                as: "user",
                cond: {
                  $eq: [{ $type: `$$user.${userId}` }, "object"],
                },
              },
            },
          },
        },
        {
          $project: {
            user: { $arrayElemAt: [`$users.${userId}`, 0] },
          },
        },
      ]);
    } else {
      data = await Model.find();
    }

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
      return "";
      // that's life
    }

    res.status(200).json(user.notifications);
  } catch (err) {
    console.log("\nerr", err, "\n");
    res.status(500).json(err);
  }
});

// GET MISSING CORE DATA
router.get("/coreData", async (req, res) => {
  let missingCoreData = [];
  try {
    const modelsToCheck = ["User", "Department", "Service", "Customer", "Role"];

    for (const modelName of modelsToCheck) {
      const model = defineModel(modelName);
      const documentExists = await model.findOne();
      if (!documentExists) {
        missingCoreData.push(translateModel(modelName));
      }
    }

    res.status(200).json(missingCoreData);
  } catch (err) {
    console.log("\nError fetching core data:", err, "\n");
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
