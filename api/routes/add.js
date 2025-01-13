const express = require("express");
const router = express.Router();
const axios = require("axios");
const bcrypt = require("bcrypt");
const User = require("../../models/models/User");
const Notifications = require("../../models/models/Notifications");
const Config = require("../../models/models/Config");

const mainQueue = require("../../queues/mainQueue");

const { defineModel } = require("../../controllers/functions/routeFunctions");

const {
  checkNewRequestDefaultStatus,
  checkNewStockEntryDefaultStatus,
} = require("../../controllers/functions/checkFunctions");

// CREATE ITEM
router.post("/", async (req, res) => {
  // console.log("\nreq.body", req.body, "\n");
  const {
    createdBy,
    fields,
    image,
    isManager,
    label,
    name,
    selectedProducts,
    services,
    price,
    selectedMembers,
  } = req.body;

  // one way of defining if user is admin
  const isAdmin = createdBy === "admin" ? true : false;

  const Model = defineModel(req.body.model);

  if (!Model) {
    console.log("\nmodel not found\n");
    return res.status(400).json({ error: "Modelo inválido" });
  }

  // ACTIONS THAT NEED TO BE DONE _BEFORE_ ITEM IS CREATED
  switch (req.body.model) {
    case "Customer":
    case "Client":
      const existingNameUser = await Model.findOne({ name });
      if (existingNameUser) {
        return res.status(422).json({ error: "Nome de Cliente já cadastrado" });
      }
      break;

    case "Operator":
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(
        req.body.fields["firstAccessPassword"],
        salt
      );
      try {
        const updatedItem = await User.findByIdAndUpdate(
          req.body.fields["user"]._id,
          {
            $set: {
              username: req.body.fields["username"],
              password: hashedPass,
              role: req.body.fields["role"]._id,
            },
          },
          { new: true }
        );

        mainQueue.add({
          type: "insertMembership",
          data: {
            id: updatedItem._id.toString(),
            role: updatedItem.role,
          },
        });

        return res.status(200).json(updatedItem);
      } catch (err) {
        console.log(err);
        return res.status(500).json(err);
      }

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
      fields.quoteValue = req.body.selectedProducts.reduce((total, product) => {
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

  // '''parsing''' (dude, wtf....)
  fields.attachments = req.body.attachments || [];
  fields.manager = req.body.fields.manager?._id || "";
  fields.members =
    req.body.fields.members?.map((member) => member._id || member) || [];
  fields.department = req.body.fields.department?._id || "";
  fields.position = req.body.fields.position?._id || "";
  fields.role = req.body.fields.role?._id || "";
  fields.members = selectedMembers;
  fields.image = image;
  fields.isManager = isManager;
  fields.createdBy = createdBy;
  fields.products = selectedProducts;
  fields.price =
    label === "Plano de Serviços"
      ? parseFloat(
          req.body.finalPrice === 0 ? req.body.price : req.body.finalPrice
        )
      : parseFloat(price);

  fields.services = services;

  const newItem = new Model(fields);

  try {
    const savedItem = await newItem.save();
    const notifications = await Notifications.findOne({});
    const config = await Config.findOne({});

    const { data: idIndexList } = await axios.get(
      "http://localhost:3000/api/idIndexList"
    );

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
            members: fields.members,
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

        mainQueue.add({
          type: "notifyAssignee",
          data: {
            target: {
              customer:
                idIndexList?.find(
                  (item) => item.id === req.body.fields.customer
                )?.name || req.body.fields.customer,
              service:
                idIndexList?.find((item) => item.id === req.body.fields.service)
                  ?.name || req.body.fields.service,
              scheduledTo:
                req.body.fields.scheduledTo ||
                req.body.fields.deliveryScheduledTo,
              scheduleTime: req.body.fields.scheduleTime,
              createdBy: req.body.createdBy,
              title: req.body.fields.title || savedItem.number,
            },
            sourceId: createdBy,
            receiver: req.body.fields.worker || req.body.fields.seller,
            receiverName:
              idIndexList?.find(
                (item) =>
                  item.id === req.body.fields.worker ||
                  item.id === req.body.fields.seller
              )?.name || "?",
            label: req.body.model === "Job" ? "Job" : "Venda",
          },
        });
        break;

      case "StockEntry":
        if (config.stock.stockEntriesNeedApproval === false) {
          mainQueue.add({
            type: "addToStock",
            data: { items: savedItem.items },
          });
        } else {
          mainQueue.add({
            type: "addCounter",
            data: {
              itemId: savedItem._id.toString(),
              model: req.body.model,
            },
          });
        }
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

    if (fields.scheduledToAssignee === true) {
      mainQueue.add({
        type: "addToAssigneeAgenda",
        data: {
          scheduledTo: savedItem.scheduledTo,
          scheduleTime: savedItem.scheduleTime,
          worker: savedItem.worker,
          itemId: savedItem._id.toString(),
          service: fields.service.name,
          customer: fields.customer,
        },
      });
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

    res.status(200).json(savedItem);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
