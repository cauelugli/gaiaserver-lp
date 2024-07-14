const express = require("express");
const router = express.Router();
const Client = require("../../models/models/Client");

// GET ALL ITEMS
router.get("/", async (req, res) => {
  try {
    const clients = await Client.find();
    res.status(200).json(clients);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
