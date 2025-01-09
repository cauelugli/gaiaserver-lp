const express = require("express");
const router = express.Router();
const axios = require("axios");
const bcrypt = require("bcrypt");
const User = require("../../models/models/User");

const mainQueue = require("../../queues/mainQueue");

const { defineModel } = require("../../controllers/functions/routeFunctions");

const {
  addRoutines,
  addCounter,
  addToAssigneeAgenda,
  checkNewRequestDefaultStatus,
  checkNewStockEntryDefaultStatus,
} = require("../../controllers/functions/addRoutines");

const {
  insertMembership,
} = require("../../controllers/functions/updateRoutines");

const {
  notificationRoutines,
} = require("../../controllers/functions/notificationRoutines");

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

  // defining if user is admin
  const isAdmin = createdBy === "admin" ? true : false;

  const Model = defineModel(req.body.model);

  if (!Model) {
    console.log("\nmodel not found\n");
    return res.status(400).json({ error: "Modelo inválido" });
  }

  // same name already registered verification
  if (req.body.model === "Customer" || req.body.model === "Client") {
    const existingNameUser = await Model.findOne({ name });
    if (existingNameUser) {
      return res.status(422).json({ error: "Nome de Cliente já cadastrado" });
    }
  }

  if (req.body.model === "Operator") {
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

      //insertMembership
      await insertMembership(
        updatedItem._id.toString(),
        // this will be dynamic at some point
        "Role",
        updatedItem.role
      );

      return res.status(200).json(updatedItem);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }

  if (req.body.model === "Job" || req.body.model === "Sale") {
    try {
      //checkNewRequestDefaultStatus
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
  }

  if (req.body.model === "StockEntry") {
    fields.quoteValue = req.body.selectedProducts.reduce((total, product) => {
      const buyValue = product.buyValue || 0;
      const count = product.count || 0;
      return total + buyValue * count;
    }, 0);
    fields.items = req.body.selectedProducts;
    try {
      //checkNewStockEntryDefaultStatus
      await checkNewStockEntryDefaultStatus(fields);
    } catch (err) {
      return res.status(500).json({
        error: "Erro ao verificar o status da requisição",
      });
    }
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
    let countedItem;
    const savedItem = await newItem.save();

    if (req.body.model === "Department" || req.body.model === "Group") {
      //insertMembersToGroup
      // await insertMembersToGroup(
      //   savedItem._id.toString(),
      //   req.body.model,
      //   fields.members
      // );

      mainQueue.add({
        type: "insertMembersToGroup",
        data: {
          id: savedItem._id.toString(),
          model: req.body.model,
          members: fields.members,
        },
      });
    } else if (
      req.body.model === "Job" ||
      req.body.model === "Sale" ||
      req.body.model === "StockEntry"
    ) {
      //addCounter
      countedItem = await addCounter(savedItem._id.toString(), req.body.model);
    } else {
      await addRoutines(req.body.model, savedItem);
    }

    if (fields.scheduledToAssignee === true) {
      //addToAssigneeAgenda
      await addToAssigneeAgenda(
        savedItem.scheduledTo,
        savedItem.scheduleTime,
        savedItem.worker,
        savedItem._id.toString(),
        fields.service.name,
        fields.customer
      );
    }

    const { data: idIndexList } = await axios.get(
      "http://localhost:3000/api/idIndexList"
    );

    await notificationRoutines(
      req.body.model,
      countedItem ? countedItem : savedItem,
      "add",
      req.body.sourceId,
      `${req.body.model.toLowerCase()}IsCreated`,
      idIndexList,
      isAdmin
    );

    res.status(200).json(savedItem);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
