const express = require("express");
const router = express.Router();
const StockItem = require("../../models/models/StockItem");
const Product = require("../../models/models/Product");
const StockEntry = require("../../models/models/StockEntry");
const FinanceOutcome = require("../../models/models/FinanceOutcome");

// GET STOCK ENTRIES
router.get("/", async (req, res) => {
  try {
    const stockEntries = await StockEntry.find();
    res.status(200).json(stockEntries);
  } catch (err) {
    res.status(500).json(err);
  }
});

// CREATE STOCK ENTRY
router.put("/", async (req, res) => {
  const itemList = req.body.itemList;
  const status = req.body.status;
  const maxStockEntry = await StockEntry.findOne().sort({ number: -1 });

  const updatedStockItems = [];

  if (req.body.type === "Estoque") {
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
        createdBy: req.body.createdBy,
        type: req.body.type,
        status: status,
        number:
          maxStockEntry && maxStockEntry.number ? maxStockEntry.number + 1 : 1,
      });
      await newStockEntry.save();

      res.json(newStockEntry);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao atualizar os itens do estoque" });
    }
  } else if (req.body.type === "Produto") {
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
        createdBy: req.body.createdBy,
        type: req.body.type,
        status: status,
        number:
          maxStockEntry && maxStockEntry.number ? maxStockEntry.number + 1 : 1,
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

// RESPONSE FROM MANAGER ENTRY APPROVAL
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

    res.status(200).json(updatedEntry);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// SEND APPROVED ENTRY TO FINANCE OUTCOME
router.put("/sendToFinance", async (req, res) => {
  try {
    const updatedEntry = await StockEntry.findByIdAndUpdate(
      req.body.entry._id,
      {
        $set: {
          status: "Enviado ao Financeiro",
        },
      },
      { new: true }
    );

    let savedFinanceOutcome;
    const newFinanceOutcome = new FinanceOutcome({
      entry: req.body.entry,
      status: "Aberto",
      // number: maxStockEntry? maxStockEntry.number + 1 : 1,
      user: req.body.entry.createdBy,
      type: `Entrada de ${req.body.entry.type}`,
      items: req.body.entry.items,
      price: req.body.entry.quoteValue.toFixed(2),
    });
    savedFinanceOutcome = await newFinanceOutcome.save();

    res.status(200).json({ updatedEntry, savedFinanceOutcome });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
