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

// UPDATE STATUS
router.put("/status", async (req, res) => {
  try {
    // make this dynamic later
    const updatedFinance = await FinanceIncome.findByIdAndUpdate(
      req.body.id,
      {
        status: req.body.status,
      },
      { new: true }
    );
    res.status(200).json(updatedFinance);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE SCHEDULE PAYMENT DATE
router.put("/schedulePayment", async (req, res) => {
  try {
    const payment = {
      paymentMethod: req.body.paymentMethod,
      paymentOption: req.body.paymentOption,
      parcelQuantity: req.body.parcelQuantity,
      hasParcelMonthlyFee: req.body.hasParcelMonthlyFee,
      parcelMonthlyFee: req.body.parcelMonthlyFee,
      finalPrice: req.body.finalPrice,
      previousData: req.body.previousData,
    };

    const scheduledPayment = await FinanceIncome.findByIdAndUpdate(
      req.body.id,
      { payment: payment },
      { new: true }
    );

    res.status(200).json(scheduledPayment);
  } catch (err) {
    res.status(500).json(err);
  }
});



module.exports = router;
