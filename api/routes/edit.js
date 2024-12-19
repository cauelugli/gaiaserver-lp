const express = require("express");
const router = express.Router();

const Admin = require("../../models/models/Admin");
const { defineModel } = require("../../controllers/functions/routeFunctions");
const {
  notificationRoutines,
} = require("../../controllers/functions/notificationRoutines");
const {
  insertMembership,
  removeMembership,
} = require("../../controllers/functions/updateRoutines");

// EDIT ITEM
router.put("/", async (req, res) => {
  const {
    fields,
    image,
    isManager,
    label,
    name,
    selectedProducts,
    services,
    price,
    selectedMembers,
    previousMembers,
  } = req.body;

  const Model = defineModel(req.body.model);

  if (!Model) {
    console.log("\nmodel not found\n");
    return res.status(400).json({ error: "Modelo inválido" });
  }

  // defining if user is admin
  let isAdmin = false;
  const admin = await Admin.findOne();
  if (admin && admin._id.toString() === req.body.sourceId) {
    isAdmin = true;
  }

  // same name already registered verification
  if (Model === "Customer") {
    const existingNameUser = await Model.findOne({ name });
    if (existingNameUser) {
      return res.status(422).json({ error: "Nome de Cliente já cadastrado" });
    }
  }

  // Busca pelo nome para obter o ID (provavelmente nao foi alterado o campo no frontend)
  if (typeof req.body.fields.department === "string") {
    const department = await defineModel("Department").findOne({
      name: req.body.fields.department,
    });
    if (department) {
      fields.department = department._id.toString();
    }
  } else {
    fields.department = req.body.fields.department?._id || "";
  }

  if (typeof req.body.fields.position === "string") {
    const position = await defineModel("Position").findOne({
      name: req.body.fields.position,
    });
    if (position) {
      fields.position = position._id.toString();
    }
  } else {
    fields.position = req.body.fields.position?._id || "";
  }

  // verify cases
  fields.image = image;
  fields.worker = req.body.fields.worker?._id || "";
  fields.scheduleTime = req.body.fields.scheduleTime || "";
  fields.scheduledToAssignee = req.body.fields.scheduledToAssignee || false;
  fields.seller = req.body.fields.seller?._id || "";
  fields.customer = req.body.fields.customer?._id || "";
  fields.role = req.body.fields.role?._id || "";
  fields.isManager = isManager;
  fields.members = selectedMembers;
  fields.products = selectedProducts;
  fields.price =
    label === "Plano de Serviços"
      ? parseFloat(
          req.body.finalPrice === 0 ? req.body.price : req.body.finalPrice
        )
      : parseFloat(price);

  fields.services = services;

  try {
    const updatedItem = await Model.findByIdAndUpdate(
      req.body.prevData._id,
      { $set: fields },
      { new: true }
    );

    await notificationRoutines(
      req.body.model,
      updatedItem,
      "edit",
      req.body.sourceId,
      `${req.body.model.toLowerCase()}IsEdited`,
      [],
      isAdmin
    );

    if (req.body.model === "Department" || req.body.model === "Group") {
      await insertMembership(
        updatedItem._id.toString(),
        req.body.model,
        selectedMembers
      );
      await removeMembership(
        updatedItem._id.toString(),
        req.body.model,
        selectedMembers,
        previousMembers
      );
    }

    res.status(200).json(updatedItem);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
