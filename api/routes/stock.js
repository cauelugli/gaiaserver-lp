const express = require("express");
const router = express.Router();
const StockItem = require("../models/StockItem");
const Product = require("../models/Product");
const StockEntry = require("../models/StockEntry");
const FinanceOutcome = require("../models/FinanceOutcome");

// GET STOCK ENTRIES
router.get("/", async (req, res) => {
  try {
    const stockEntries = await StockEntry.find();
    res.status(200).json(stockEntries);
  } catch (err) {
    res.status(500).json(err);
  }
});

// REQUEST STOCK ENTRY APPROVAL
router.put("/requestApproval", async (req, res) => {
  try {
    const updatedEntry = await StockEntry.findByIdAndUpdate(
      req.body.entryId,
      {
        $set: {
          status: "Aprovação Solicitada",
        },
      },
      { new: true }
    );
    res.status(200).json(updatedEntry);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// REQUEST MANAGER ENTRY APPROVAL
router.put("/managerApproval", async (req, res) => {
  try {
    const updatedEntry = await StockEntry.findByIdAndUpdate(
      req.body.entryId,
      {
        $set: {
          status: req.body.status,
        },
      },
      { new: true }
    );

    let savedFinanceOutcome;

    if (req.body.status === "Aprovado") {
      const newFinanceOutcome = new FinanceOutcome({
        id: req.body.entry._id,
        type: req.body.entry.type,
        user: req.body.user.name,
        type: "Entrada de Estoque",
        department: req.body.user.department.name,
        items: req.body.entry.items,
        price: req.body.entry.quoteValue.toFixed(2),
      });
      savedFinanceOutcome = await newFinanceOutcome.save();
    }
    res.status(200).json({ updatedEntry, savedFinanceOutcome });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.put("/", async (req, res) => {
  const itemList = req.body.itemList;
  const user = req.body.createdBy;
  const updatedStockItems = [];

  if (req.body.type === "stock") {
    try {
      let totalValue = 0;
      const items = [];

      for (const item of itemList) {
        const { _id, selectedQuantity, buyValue } = item;
        const stockItem = await StockItem.findById(_id);
        stockItem.quantity += selectedQuantity;
        await stockItem.save();
        updatedStockItems.push(stockItem);

        items.push({
          item: stockItem,
          quantity: selectedQuantity,
          buyValue: buyValue,
        });

        totalValue += stockItem.buyValue * selectedQuantity;
      }

      const newStockEntry = new StockEntry({
        items: items,
        quoteValue: totalValue,
        createdBy: user,
      });
      await newStockEntry.save();

      res.json(newStockEntry);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao atualizar os itens do estoque" });
    }
  } else if (req.body.type === "product") {
    try {
      let totalValue = 0;
      const items = [];

      for (const item of itemList) {
        const { _id, selectedQuantity, buyValue } = item;
        const product = await Product.findById(_id);
        product.quantity += selectedQuantity;
        await product.save();
        updatedStockItems.push(product);

        items.push({
          item: product,
          quantity: selectedQuantity,
          buyValue: buyValue,
        });

        totalValue += product.buyValue * selectedQuantity;
      }

      const newStockEntry = new StockEntry({
        items: items,
        quoteValue: totalValue,
        createdBy: user,
      });
      await newStockEntry.save();

      res.json(newStockEntry);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao atualizar os itens do estoque" });
    }
  } else {
    res.status(404).json({ error: "Tipo de item não localizado" });
  }
});

module.exports = router;
