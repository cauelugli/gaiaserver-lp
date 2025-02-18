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

const {
  checkNewRequestDefaultStatus,
  checkNewStockEntryDefaultStatus,
  checkSameName,
} = require("../../controllers/functions/checkFunctions");

// CREATE ITEM
router.post("/", async (req, res) => {
  // console.log("\nreq.body", req.body, "\n");
  const { createdBy, fields, selectedProducts } = req.body;

  // one way of defining if user is admin
  const isAdmin = createdBy === "admin" ? true : false;

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
    case "Operator":
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(
        req.body.fields["firstAccessPassword"],
        salt
      );

      mainQueue.add({
        type: "addOperator",
        data: {
          id: req.body.fields["user"]._id.toString(),
          username: req.body.fields["username"],
          password: hashedPass,
          role: req.body.fields["role"]._id.toString(),
        },
      });

      mainQueue.add({
        type: "insertMembership",
        data: {
          id: req.body.fields["user"]._id.toString(),
          role: req.body.fields["role"],
        },
      });

      break;
    case "Job":
    case "Sale":
      try {
        await checkNewRequestDefaultStatus(fields, selectedProducts);
      } catch (err) {
        if (err.message === "Itens indisponíveis em estoque") {
          return res.status(406).json({
            error: "Itens indisponíveis em estoque",
          });
        }
        return res.status(500).json({
          error: "Erro ao verificar o status da requisição",
        });
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
      try {
        await checkNewStockEntryDefaultStatus(fields);
      } catch (err) {
        return res.status(500).json({
          error: "Erro ao verificar o status da requisição",
        });
      }
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
    if (req.body.model !== "Operator") {
      savedItem = await newItem.save();
    }

    // ACTIONS THAT NEED TO BE DONE _AFTER_ ITEM IS CREATED

    switch (req.body.model) {
      case "Service":
        mainQueue.add({
          type: "addServiceToDepartment",
          data: {
            serviceId: savedItem._id.toString(),
            departmentId: savedItem.department,
          },
        });
        break;

      case "Department":
      case "Group":
        mainQueue.add({
          type: "insertMembersToGroup",
          data: {
            id: savedItem._id.toString(),
            model: req.body.model,
            members: processedFields.members,
          },
        });
        break;

      case "Job":
      case "Sale":
        mainQueue.add({
          type: "addCounter",
          data: {
            itemId: savedItem._id.toString(),
            model: req.body.model,
          },
        });

        if (config.requests.requestsNeedApproval === false) {
          mainQueue.add({
            type: "removeFromStock",
            data: { items: savedItem.products },
          });
        }

        mainQueue.add({
          type: "notifyAssignee",
          data: {
            target: {
              customer: req.body.fields.customer,
              service: req.body.fields.service,
              scheduledTo:
                req.body.fields.scheduledTo ||
                req.body.fields.deliveryScheduledTo,
              scheduleTime: req.body.fields.scheduleTime,
              createdBy: req.body.createdBy,
              title: req.body.fields.title || savedItem.number,
            },
            sourceId: createdBy,
            receiver: req.body.fields.worker || req.body.fields.seller,
            receiverName: req.body.fields.worker || req.body.fields.seller,
            label: req.body.model === "Job" ? "Job" : "Venda",
          },
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

      case "User":
        mainQueue.add({
          type: "addUserRoutines",
          data: {
            model: req.body.model,
            item: savedItem,
          },
        });
        break;

      default:
        break;
    }

    mainQueue.add({
      type: "notificationToList",
      data: {
        model: req.body.model,
        method: "add",
        item: savedItem,
        sourceId: req.body.sourceId,
        notificationList: notifications[
          req.body.model === "Client"
            ? "customer"
            : req.body.model.toLowerCase()
        ][
          `${
            req.body.model === "Client"
              ? "customer"
              : req.body.model.toLowerCase()
          }IsCreated`
        ] || [""],
      },
      isAdmin,
    });

    mainQueue.add({ type: "refreshIdIndexList" });

    res.status(200).json(savedItem);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
