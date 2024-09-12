const express = require("express");
const router = express.Router();
const { defineModel } = require("../../controllers/functions/routeFunctions");

// CREATE ITEM
router.put("/", async (req, res) => {
  // console.log("\nreq.body", req.body, "\n");
  const {
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

  // same name already registered verification
  if (Model === "Customer") {
    const existingNameUser = await Model.findOne({ name });
    if (existingNameUser) {
      return res.status(422).json({ error: "Nome de Cliente já cadastrado" });
    }
  }

  // verify cases
  fields.image = image;
  fields.department = req.body.fields.department._id;
  fields.position = req.body.fields.position._id;
  fields.role = req.body.fields.role?._id || "";
  fields.isManager = isManager;
  fields.products = selectedProducts;
  fields.price =
    label === "Plano de Serviços"
      ? parseFloat(
          req.body.finalPrice === 0 ? req.body.price : req.body.finalPrice
        )
      : parseFloat(price);

  fields.services = services;

  try {
    const updatedItem = await Model.findByIdAndUpdate(
      req.body.prevData._id,
      { $set: fields },
      { new: true }
    );

    res.status(200).json(updatedItem);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
