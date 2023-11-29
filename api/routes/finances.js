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
  const paymentDates = req.body.paymentDates;
  const parcelValue = req.body.parcelValue;

  try {
    const payment = {
      paymentMethod: req.body.paymentMethod,
      paymentOption: req.body.paymentOption,
      parcelQuantity: req.body.parcelQuantity,
      hasParcelMonthlyFee: req.body.hasParcelMonthlyFee,
      parcelMonthlyFee: req.body.parcelMonthlyFee,
      finalPrice: req.body.finalPrice,
      paymentDates: {},
    };

    for (const key in paymentDates) {
      const date = paymentDates[key];
      payment.paymentDates[key] = {
        date: date,
        parcelValue: parcelValue.toFixed(2),
        status: "Em Aberto",
        paymentMethod: "",
        paidAt: "",
      };
    }

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

// UPDATE PARCEL PAYMENT
router.put("/receivePayment/parcel", async (req, res) => {
  try {
    const { id, paymentData } = req.body;

    // Busque o financeIncome pelo ID
    const financeIncome = await FinanceIncome.findById(id);

    if (!financeIncome) {
      return res.status(404).json({ error: "FinanceIncome não encontrado." });
    }

    // Atualize as parcelas com as informações recebidas
    paymentData.forEach((data) => {
      const matchingDateIndex = Object.keys(
        financeIncome.payment.paymentDates
      ).find(
        (key) => financeIncome.payment.paymentDates[key].date === data.date
      );

      if (
        matchingDateIndex !== undefined &&
        financeIncome.payment.paymentDates[matchingDateIndex].status !==
          "Pago" &&
        data.paidAt !== ""
      ) {
        financeIncome.payment.paymentDates[matchingDateIndex].status = "Pago";
        financeIncome.payment.paymentDates[matchingDateIndex].paymentMethod =
          data.paymentMethod;
        financeIncome.payment.paymentDates[matchingDateIndex].paidAt =
          data.paidAt;
      }
    });

    // Salve as alterações
    await financeIncome.markModified("payment.paymentDates");
    await financeIncome.save();

    async function checkAndUpdatePaymentStatus() {
      const paymentDates = financeIncome.payment.paymentDates;

      // Verifica se todas as parcelas foram pagas
      const allPaymentsPaid = Object.values(paymentDates).every(
        (date) => date.status === "Pago"
      );

      // Atualiza o status do income, se necessário
      if (allPaymentsPaid && financeIncome.status !== "Pago") {
        financeIncome.status = "Pago";
        await financeIncome.save();
      }
    }

    // Verifique e atualize o status do income, se necessário
    await checkAndUpdatePaymentStatus();

    return res
      .status(200)
      .json({ message: "Parcelas atualizadas com sucesso." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao processar a atualização." });
  }
});

module.exports = router;
