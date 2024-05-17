const express = require("express");
const router = express.Router();
const Client = require("../../models/models/Client");
const Customer = require("../../models/models/Customer");
const Job = require("../../models/models/Job");
const Sale = require("../../models/models/Sale");
const User = require("../../models/models/User");
const Manager = require("../../models/models/Manager");

// MODELS MAPPING
const models = {
  Client: Client,
  Customer: Customer,
  Job: Job,
  Sale: Sale,
  User: User,
  Manager: Manager,
};

// ACTIVATE/INACTIVATE ITEM
router.put("/:id", async (req, res) => {
  const itemId = req.params.id;
  const modelName = req.body.model;

  const model = models[modelName];

  try {
    const updatedItem = await model.findByIdAndUpdate(
      itemId,
      {
        isActive: req.body.isActive,
        status: req.body.status,
      },
      { new: true }
    );
    res.status(200).json(updatedItem);
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ error: "Erro ao atualizar o item", details: err });
  }
});

module.exports = router;
