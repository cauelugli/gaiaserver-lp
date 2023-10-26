const express = require("express");
const router = express.Router();
const Sale = require("../models/Sale");
const Product = require("../models/Product");

// GET ALL SALES
router.get("/", async (req, res) => {
  try {
    const sales = await Sale.find();
    res.status(200).json(sales);
  } catch (err) {
    res.status(500).json(err);
  }
});

// CREATE SALES
router.post("/", async (req, res) => {
  const newSale = new Sale(req.body);
  if (newSale.items.length > 0) {
    for (const item of newSale.items) {
      const items = await Product.findById(item._id);
      items.quantity -= item.quantity;
      await items.save();
    }
  }
  try {
    const savedSale = await newSale.save();
    res.status(200).json(savedSale);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// DELETE SALES
router.delete("/:id", async (req, res) => {
  const saleId = req.params.id;
  try {
    const deletedSale = await Sale.findByIdAndDelete(saleId);
    res.status(200).json(deletedSale);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;