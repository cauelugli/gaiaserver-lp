const Counters = require("../../models/models/Counters");
const FinanceIncome = require("../../models/models/FinanceIncome");
const FinanceOutcome = require("../../models/models/FinanceOutcome");
const Job = require("../../models/models/Job");
const Sale = require("../../models/models/Sale");
const StockEntry = require("../../models/models/StockEntry");

async function addCounter(sourceId, model) {
  try {
    let counter = await Counters.findOne();
    if (!counter) {
      counter = new Counters({
        job: model === "Job" ? 1 : 0,
        sale: model === "Sale" ? 1 : 0,
        stockEntry: model === "StockEntry" ? 1 : 0,
        financeIncome: model === "FinanceIncome" ? 1 : 0,
        financeOutcome: model === "FinanceOutcome" ? 1 : 0,
      });
    }
    let newNumber;

    switch (model) {
      case "Job":
        newNumber = counter.job + 1;
        counter.job = newNumber;
        await Job.findByIdAndUpdate(sourceId, { $set: { number: newNumber } });
        break;
      case "Sale":
        newNumber = counter.sale + 1;
        counter.sale = newNumber;
        await Sale.findByIdAndUpdate(sourceId, { $set: { number: newNumber } });
        break;
      case "FinanceIncome":
        newNumber = counter.financeIncome + 1;
        counter.financeIncome = newNumber;
        await FinanceIncome.findByIdAndUpdate(sourceId, {
          $set: { number: newNumber },
        });
        break;
      case "FinanceOutcome":
        newNumber = counter.financeOutcome + 1;
        counter.financeOutcome = newNumber;
        await FinanceOutcome.findByIdAndUpdate(sourceId, {
          $set: { number: newNumber },
        });
        break;
      case "StockEntry":
        newNumber = counter.stockEntry + 1;
        counter.stockEntry = newNumber;
        await StockEntry.findByIdAndUpdate(sourceId, {
          $set: { number: newNumber },
        });
        break;
      default:
        throw new Error(`Modelo não suportado: ${model}`);
    }

    await counter.save();
  } catch (err) {
    console.error(`Erro na rotina de adição em ${model}:`, err);
  }
}

async function addFinanceIncome(data) {
  try {
    const newFinanceIncome = new FinanceIncome({
      itemId: data.resolvedItem._id.toString(),
      itemNumber: data.resolvedItem.number,
      customer: data.resolvedItem.customer,
      service: data.resolvedItem.service,
      price: data.resolvedItem.price,
      items: data.resolvedItem.items || data.resolvedItem.products,
      typeIncome: data.type,
    });
    const savedFinanceIncome = await newFinanceIncome.save();
    await addCounter(savedFinanceIncome._id, "FinanceIncome");
  } catch (err) {
    console.error(`Erro ao criar finance income:`, err);
  }
}

async function addFinanceOutcome(data) {
  try {
    const newFinanceOutcome = new FinanceOutcome({
      itemId: data.resolvedItem._id.toString(),
      itemNumber: data.resolvedItem.number,
      price: data.resolvedItem.price,
      items: data.resolvedItem.items,
      typeOutcome: data.type,
    });
    const savedFinanceOutcome = await newFinanceOutcome.save();
    await addCounter(savedFinanceOutcome._id, "FinanceOutcome");
  } catch (err) {
    console.error(`Erro ao criar finance outcome:`, err);
  }
}

module.exports = {
  addCounter,
  addFinanceOutcome,
  addFinanceIncome,
};
