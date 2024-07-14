const express = require("express");
const router = express.Router();
const { defineModel } = require("../../controllers/functions/routeFunctions");

// CREATE ITEM
router.post("/", async (req, res) => {
  const { fields, name } = req.body;
  // console.log("fields", fields);

  const Model = defineModel(req.body.model);

  if (!Model) {
    return res.status(400).json({ error: "Tipo de cliente inválido" });
  }

  const existingNameUser = await Model.findOne({ name });

  if (existingNameUser) {
    return res.status(422).json({ error: "Nome de Cliente já cadastrado" });
  }

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
