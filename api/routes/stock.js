const express = require("express");
const router = express.Router();
const StockItem = require("../models/StockItem");

// UPDATE STOCK ITEMS
router.put("/", async (req, res) => {
  console.log("modifiedItems", modifiedItems);

  // try {
  //   const updatedStockItem = await StockItem.findByIdAndUpdate(
  //     req.body.stockItemId,
  //     {
  //       buyValue: req.body.buyValue,
  //       quantity: req.body.quantity,
  //     },
  //     { new: true }
  //   );
  //   res.status(200).json(updatedStockItem);
  // } catch (err) {
  //   res.status(500).json(err);
  // }

});

module.exports = router;
