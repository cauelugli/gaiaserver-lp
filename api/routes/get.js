const express = require("express");
const router = express.Router();
const { defineModel } = require("../../controllers/functions/routeFunctions");

// GET ALL ITEMS BASED ON MODEL PARAMETER
router.get("/", async (req, res) => {
  const { model } = req.query;
  const Model = defineModel(model);

  if (!Model) {
    console.log("\nmodel not found\n")
    return res.status(400).json({ error: "Invalid model specified" });
  }

  try {
    const data = await Model.find();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
