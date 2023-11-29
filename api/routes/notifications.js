const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Notification = require("../models/Notification");

// GET ALL NOTIFICATIONS
router.get("/", async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json(err);
  }
});

// CREATE GENERIC NOTIFICATION
router.post("/", async (req, res) => {
  const newNotification = new Notification(req.body);
  try {
    const savedNotification = await newNotification.save();
    res.status(200).json(savedNotification);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// DELETE NOTIFICATION
// router.delete("/:id", async (req, res) => {
//   const stockItemId = req.params.id;

//   try {
//     const deletedStockItem = await StockItem.findByIdAndDelete(stockItemId);
//     res.status(200).json(deletedStockItem);
//   } catch (err) {
//     console.log(err)
//     res.status(500).json(err);
//   }
// });

// UPDATE NOTIFICATION
// router.put("/", async (req, res) => {
//   try {
//     const updatedStockItem = await StockItem.findByIdAndUpdate(
//       req.body.stockItemId,
//       {
//         name: req.body.name,
//         sellValue: req.body.sellValue,
//         buyValue: req.body.buyValue,
//         image: req.body.image,
//       },
//       { new: true }
//     );
//     res.status(200).json(updatedStockItem);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

module.exports = router;
