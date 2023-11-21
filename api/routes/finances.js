const express = require("express");
const router = express.Router();
const FinanceIncome = require("../models/FinanceIncome");

// GET ALL FINANCES
router.get("/", async (req, res) => {
  try {
    const incomes = await FinanceIncome.find();
    res.status(200).json(incomes);
  } catch (err) {
    res.status(500).json(err);
  }
});

// CREATE INCOME
router.post("/income/", async (req, res) => {
  const newIncome = new FinanceIncome(req.body);
  try {
    const savedIncome = await newIncome.save();
    res.status(200).json(savedIncome);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// // CREATE OUTCOME
// router.post("/outcome/", async (req, res) => {
//   const newClient = new Client(req.body);
//   try {
//     const savedClient = await newClient.save();
//     res.status(200).json(savedClient);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json(err);
//   }
// });


// UPDATE INCOME/OUTCOME
router.put("/", async (req, res) => {
  try {
    // make this dynamic later
    const updatedFinance = await FinanceIncome.findByIdAndUpdate(
      req.body.financeId,
      {
        type: req.body.type,
        status: req.body.status,
        quote: req.body.status,
        user: req.body.status,
        department: req.body.status,
        items: req.body.status,
        price: req.body.status,
        commissioned: req.body.status,
        commission: req.body.status,
      },
      { new: true }
    );
    res.status(200).json(updatedFinance);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
