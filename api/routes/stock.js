const express = require("express");
const router = express.Router();
const StockItem = require("../models/StockItem");
const StockEntry = require("../models/StockEntry");

// GER STOCK ENTRIES
router.get("/", async (req, res) => {
  try {
    const stockEntries = await StockEntry.find();
    res.status(200).json(stockEntries);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE STOCK ITEMS
router.put("/", async (req, res) => {
  const itemList = req.body.itemList;
  const updatedStockItems = [];
  const newStockEntry = new StockEntry(itemList);

  try {
    const savedStockEntry = await newStockEntry.save();
    for (const item of itemList) {
      const { _id, selectedQuantity } = item;
      const stockItem = await StockItem.findById(_id);
      stockItem.quantity += selectedQuantity;
      await stockItem.save();
      updatedStockItems.push(stockItem);
    }
    res.json({updatedStockItems, savedStockEntry});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar os itens do estoque' });
  }
});


module.exports = router;
