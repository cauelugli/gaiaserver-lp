const express = require("express");
const router = express.Router();
const Quote = require("../models/Quote");

// GER STOCK ENTRIES
router.get("/", async (req, res) => {
  try {
    const quotes = await Quote.find();
    res.status(200).json(quotes);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
