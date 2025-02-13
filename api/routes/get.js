const express = require("express");
const router = express.Router();
const { defineModel } = require("../../controllers/functions/routeFunctions");
const { translateModel } = require("../../controllers/notificationOptions");

// don't try this at home!
// if (model === "Unexisting_Model_in_Database") {
//   const newItem = new Model();
//   const savedItem = await newItem.save();
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
    let data;
    data = await Model.find();

    switch (model) {
      case "User":
        data = data.map((user) => {
          const { password, notifications, ...rest } = user.toObject();
          return rest;
        });
        break;
      default:
        break;
    }

    res.status(200).json(data);
  } catch (err) {
    console.log("\nerr", err, "\n");
    res.status(500).json(err);
  }
});

// GET DASHBOARD DATA
router.get("/dashboard", async (req, res) => {
  let models = [];
  try {
    const modelsToCheck = ["User", "Job", "Sale"];

    for (const modelName of modelsToCheck) {
      const model = defineModel(modelName);
      let data;

      if (modelName === "User") {
        // Para "User", buscamos apenas o campo 'createdAt'
        data = await model.find({}, { createdAt: 1, _id: 1 });
      } else if (modelName === "Job") {
        data = await model.find(
          {},
          { createdAt: 1, customer: 1, number: 1, service: 1, _id: 0 }
        );
      } else if (modelName === "Sale") {
        data = await model.find(
          {},
          { createdAt: 1, customer: 1, number: 1, seller: 1, _id: 0 }
        );
      }

      // Adiciona os dados ao objeto de resposta
      models.push({
        model: modelName,
        data: data,
      });
    }

    // Retorna os dados no formato esperado pelo frontend
    res.status(200).json(models);
  } catch (err) {
    console.log("\nError fetching core data:", err, "\n");
    res.status(500).json({ error: "Internal server error" });
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

// GET USER AGENDA
router.get("/userAgenda/:userId", async (req, res) => {
  const { userId } = req.params;

  const Job = defineModel("Job");
  const Sale = defineModel("Sale");

  try {
    const jobs = await Job.find({ worker: userId });
    const sales = await Sale.find({ seller: userId });

    const userAgenda = {
      jobs: jobs.map((job) => ({
        id: job._id.toString(),
        day: job.scheduledTo.slice(0, 2) || "",
        type: "job",
      })),
      sales: sales.map((sale) => ({
        id: sale._id.toString(),
        day: sale.deliveryScheduledTo.slice(0, 2) || "",
        type: "sale",
      })),
    };

    res.status(200).json(userAgenda);
  } catch (err) {
    console.log("\nerr", err, "\n");
    res.status(500).json(err);
  }
});

module.exports = router;
