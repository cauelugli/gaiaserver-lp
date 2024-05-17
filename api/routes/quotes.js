const express = require("express");
const router = express.Router();
const Quote = require("../../models/models/Quote");

// GET QUOTES
router.get("/", async (req, res) => {
  try {
    const quotes = await Quote.find();
    res.status(200).json(quotes);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE QUOTE
router.delete("/:id", async (req, res) => {
  const quoteId = req.params.id;
  try {
    const deletedQuote = await Quote.findByIdAndDelete(quoteId);
    res.status(200).json(deletedQuote);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
