const express = require("express");
const router = express.Router();
const { defineModel } = require("../../controllers/functions/routeFunctions");

// CREATE ITEM
router.post("/", async (req, res) => {
  const {
    createdBy,
    fields,
    image,
    isManager,
    label,
    name,
    selectedProducts,
    services,
    price,
  } = req.body;

  const Model = defineModel(req.body.model);

  if (!Model) {
    console.log("\nmodel not found\n");
    return res.status(400).json({ error: "Modelo inválido" });
  }

  if (Model === "Cliente Empresa" || Model === "Cliente Pessoa Física") {
    const existingNameUser = await Model.findOne({ name });
    if (existingNameUser) {
      return res.status(422).json({ error: "Nome de Cliente já cadastrado" });
    }
  }

  console.log("\nreq.body", req.body, "\n");

  // verify cases
  fields.image = image;
  fields.isManager = isManager;
  fields.createdBy = createdBy;
  fields.products = selectedProducts;
  fields.price =
  label === "Plano de Serviços"
  ? parseFloat(req.body.finalPrice === 0 ? req.body.price : req.body.finalPrice)
  : parseFloat(price);
  
  fields.services = services;

  
  const newItem = new Model(fields);

  try {
    const savedItem = await newItem.save();
    res.status(200).json(savedItem);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
