const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Config = require("../../models/models/Config");
const Counters = require("../../models/models/Counters");
const Notifications = require("../../models/models/Notifications");

const mainQueue = require("../../queues/mainQueue");

const {
  defineModel,
  parseReqFields,
} = require("../../controllers/functions/routeFunctions");

const { checkSameName } = require("../../controllers/functions/checkFunctions");

// CREATE ITEM
router.post("/", async (req, res) => {
  // console.log("\nreq.body", req.body, "\n");
  const { fields, selectedProducts } = req.body;

  // one way of defining if user is admin
  const isAdmin = true;

  const Model = defineModel(req.body.model);

  if (!Model) {
    console.log("\nmodel not found\n");
    return res.status(400).json({ error: "Modelo inválido" });
  }

  const notifications = await Notifications.findOne({});
  const config = await Config.findOne({});
  const counters = await Counters.findOne();
  let filteredCounter;

  switch (req.body.model) {
    case "Job":
      filteredCounter = counters.job + 1;
      break;
    case "Sale":
      filteredCounter = counters.sale + 1;
      break;
    case "StockEntry":
      filteredCounter = counters.stockEntry + 1;
      break;
    default:
      filteredCounter = 0;
      break;
  }

  // ACTIONS THAT NEED TO BE DONE _BEFORE_ ITEM IS CREATED
  switch (req.body.model) {
    case "Customer":
    case "Client":
      try {
        await checkSameName({
          model: req.body.model,
          name: req.body.fields.name || req.body.name,
        });
      } catch (err) {
        return res.status(422).json({ error: err.message });
      }
      break;
    case "StockEntry":
      //change thiss
      fields.price = req.body.selectedProducts.reduce((total, product) => {
        const buyValue = product.buyValue || 0;
        const count = product.count || 0;
        return total + buyValue * count;
      }, 0);
      fields.items = req.body.selectedProducts;
      break;
    default:
      break;
  }

  // parsing fields
  const processedFields = parseReqFields(
    req.body.fields,
    req.body,
    filteredCounter
  );

  const newItem = new Model(processedFields);

  try {
    let savedItem;
    // ACTIONS THAT NEED TO BE DONE _AFTER_ ITEM IS CREATED
    savedItem = await newItem.save();

    switch (req.body.model) {
      case "Job":
      case "Sale":
        mainQueue.add({
          type: "addCounter",
          data: {
            itemId: savedItem._id.toString(),
            model: req.body.model,
          },
        });

        mainQueue.add({
          type: "removeFromStock",
          data: { items: savedItem.products },
        });

        break;

      case "StockEntry":
        mainQueue.add({
          type: "addCounter",
          data: {
            itemId: savedItem._id.toString(),
            model: req.body.model,
          },
        });
        break;

      default:
        break;
    }

    mainQueue.add({ type: "refreshIdIndexList" });

    res.status(200).json(savedItem);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
