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
    res.status(200).json(data);
  } catch (err) {
    console.log("\nerr", err, "\n");
    res.status(500).json(err);
  }
});

// GET REPORTS DATA
router.get("/reports", async (req, res) => {
  let models = [];
  try {
    const modelsToCheck = [
      "Job",
      "Sale",
      "StockEntry",
      "Customer",
      "Client",
    ];

    for (const modelName of modelsToCheck) {
      const model = defineModel(modelName);
      let data;

      if (modelName === "Job") {
        data = await model.find(
          {},
          {
            status: 1,
            title: 1,
            customer: 1,
            service: 1,
            address: 1,
            scheduledTo: 1,
            scheduleTime: 1,
            createdAt: 1,
            resolvedAt: 1,
            resolution: 1,
            products: 1,
            price: 1,
            number: 1,
            _id: 1,
          }
        );
      } else if (modelName === "Sale") {
        data = await model.find(
          {},
          {
            createdAt: 1,
            status: 1,
            products: 1,
            customer: 1,
            deliveryScheduledTo: 1,
            deliveryAddress: 1,
            createdAt: 1,
            resolvedAt: 1,
            resolution: 1,
            number: 1,
            _id: 1,
          }
        );
      } else if (modelName === "StockEntry") {
        data = await model.find(
          {},
          {
            status: 1,
            items: 1,
            createdAt: 1,
            resolvedAt: 1,
            number: 1,
            _id: 1,
          }
        );
      } else if (modelName === "Customer" || modelName === "Client") {
        data = await model.find({}, { name: 1, _id: 1 }); // Busca apenas nome e ID
      }

      models.push({
        model: modelName,
        data: data,
      });
    }

    // Adiciona um novo item para as requisições por cliente
    const requestsPerCustomer = await getRequestsPerCustomer(models);
    models.push({
      model: "requestsPerCustomer",
      data: requestsPerCustomer,
    });

    res.status(200).json(models);
  } catch (err) {
    console.log("\nError fetching core data:", err, "\n");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Função para processar requisições por cliente
const getRequestsPerCustomer = async (models) => {
  const customers = models.find((item) => item.model === "Customer").data;
  const clients = models.find((item) => item.model === "Client").data;
  const jobs = models.find((item) => item.model === "Job").data;
  const sales = models.find((item) => item.model === "Sale").data;

  // Combina Customer e Client em uma única lista
  const allClients = [...customers, ...clients];

  // Mapeia as requisições por cliente
  const requestsPerCustomer = allClients.map((client) => {
    const clientJobs = jobs.filter(
      (job) => job.customer === client._id.toString()
    );
    const clientSales = sales.filter(
      (sale) => sale.customer === client._id.toString()
    );

    return {
      clientId: client._id,
      clientName: client.name,
      requests: [
        ...clientJobs.map((job) => ({ ...job, type: "Job" })), // Flag como Job
        ...clientSales.map((sale) => ({ ...sale, type: "Sale" })), // Flag como Sale
      ],
    };
  });

  return requestsPerCustomer;
};

// GET MISSING CORE DATA
router.get("/coreData", async (req, res) => {
  let missingCoreData = [];
  try {
    const modelsToCheck = ["Customer"];

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
router.get("/userAgenda", async (req, res) => {
  const Job = defineModel("Job");
  const Sale = defineModel("Sale");

  try {
    const jobs = await Job.find();
    const sales = await Sale.find();

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
