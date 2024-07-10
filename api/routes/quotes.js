const express = require("express");
const router = express.Router();
const Quote = require("../../models/models/Quote");

// GET JOB QUOTES
router.get("/jobs", async (req, res) => {
  try {
    const quotes = await Quote.find();
    res.status(200).json(quotes.filter((quote) => quote.type === "job"));
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET SALE QUOTES
router.get("/sales", async (req, res) => {
  try {
    const quotes = await Quote.find();
    res.status(200).json(quotes.filter((quote) => quote.type === "sale"));
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
