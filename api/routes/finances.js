const express = require("express");
const router = express.Router();
const FinanceIncome = require("../models/FinanceIncome");
const FinanceOutcome = require("../models/FinanceOutcome");
const StockEntry = require("../models/StockEntry");

// GET ALL FINANCE INCOMES
router.get("/income", async (req, res) => {
  try {
    const incomes = await FinanceIncome.find();
    res.status(200).json(incomes);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET ALL FINANCES OUTCOMES
router.get("/outcome", async (req, res) => {
  try {
    const outcomes = await FinanceOutcome.find();
    res.status(200).json(outcomes);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE INCOME
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

// UPDATE OUTCOME
router.put("/", async (req, res) => {
  try {
    // make this dynamic later
    const updatedFinance = await FinanceOutcome.findByIdAndUpdate(
      req.body.financeId,
      {
        type: req.body.type,
        status: req.body.status,
        quote: req.body.status,
        user: req.body.status,
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

  try {
    let payment = {};

    if (req.body.paymentOption === "A vista") {
      payment = {
        date: req.body.cashPaymentDate,
        price: req.body.finalPrice,
        parcelValue: req.body.parcelValue.toFixed(2),
        status: "Em Aberto",
        paymentMethod: req.body.paymentMethod,
        paymentOption: req.body.paymentOption,
        paidAt: "",
      };
    } else {
      payment = {
        paymentMethod: req.body.paymentMethod,
        paymentOption: req.body.paymentOption,
        parcelQuantity: req.body.parcelQuantity,
        hasParcelMonthlyFee: req.body.hasParcelMonthlyFee,
        parcelMonthlyFee: req.body.parcelMonthlyFee,
        hasDiscount: req.body.hasDiscount,
        discount: req.body.discount,
        finalPrice: req.body.finalPrice,
        paymentDates: {},
      };

      for (const key in paymentDates) {
        const date = paymentDates[key];
        payment.paymentDates[key] = {
          date: date,
          parcelValue: req.body.parcelValue.toFixed(2),
          status: "Em Aberto",
          paymentMethod: "",
          paidAt: "",
        };
      }
    }

    const scheduledPayment = await FinanceIncome.findByIdAndUpdate(
      req.body.id,
      {
        payment: payment,
        status: "Agendado",
      },
      { new: true }
    );

    res.status(200).json(scheduledPayment);
  } catch (err) {
    console.log(err);
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
    financeIncome.status = "Aguardando Pagamento";
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
        financeIncome.paidAt = new Date().toLocaleDateString("pt-BR");
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

// RECEIVE CASH PAYMENT
router.put("/receivePayment/cash", async (req, res) => {
  try {
    const {
      id,
      date,
      method,
      hasDiscount,
      discount,
      finalPrice,
      previousData,
    } = req.body;

    let financeIncome;

    const financeIncomeItem = await FinanceIncome.findById(id);
    if (financeIncomeItem) {
      financeIncome = financeIncomeItem;
    } else {
      const financeOutcomeItem = await FinanceOutcome.findById(id);
      if (financeOutcomeItem) {
        financeIncome = financeOutcomeItem;
      } else {
        return res.status(404).json({ error: "FinanceIncome não encontrado." });
      }
    }

    financeIncome.status = "Pago";
    financeIncome.paidAt = date;
    financeIncome.payment = {
      cash: true,
      method: method,
      hasDiscount: hasDiscount,
      discount: discount,
    };
    if (finalPrice !== previousData.price) {
      financeIncome.finalPrice = finalPrice;
    } else {
      financeIncome.finalPrice = previousData.price;
    }

    // Salve as alterações
    await financeIncome.save();

    res
      .status(200)
      .json({ message: "Pagamento à vista recebido com sucesso." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao processar o pagamento à vista." });
  }
});

// CHALLENGE ENTRY APPROVAL
router.post("/challengeApproval", async (req, res) => {
  try {
    const updatedOutcome = await FinanceOutcome.findByIdAndUpdate(
      req.body.selectedFinanceOutcomeId,
      {
        $set: {
          status: "Contestado",
        },
      },
      { new: true }
    );

    const updatedEntry = await StockEntry.findByIdAndUpdate(
      req.body.entryId,
      {
        $set: {
          status: "Contestado",
        },
      },
      { new: true }
    );

    res.status(200).json({ updatedOutcome, updatedEntry });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
