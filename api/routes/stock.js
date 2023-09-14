const express = require("express");
const router = express.Router();
const StockItem = require("../models/StockItem");

// UPDATE STOCK ITEMS
router.put("/", async (req, res) => {
  const itemList = req.body.itemList;
  const updatedStockItems = [];

  try {
    for (const item of itemList) {
      const { _id, selectedQuantity } = item;
      const stockItem = await StockItem.findById(_id);
      stockItem.quantity += selectedQuantity;
      await stockItem.save();
      updatedStockItems.push(stockItem);
    }
    res.json(updatedStockItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar os itens do estoque' });
  }
});


module.exports = router;
