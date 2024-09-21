const express = require("express");
const router = express.Router();
const {
  defineModel,
  departmentUpdates,
} = require("../../controllers/functions/routeFunctions");

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
  } = req.body;

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

  // verify cases
  fields.attachments = req.body.attachments || [];
  fields.manager = req.body.fields.manager?._id || "";
  fields.members =
    req.body.fields.members?.map((member) => member._id || member) || [];
  fields.department = req.body.fields.department?._id || "";
  fields.position = req.body.fields.position?._id || "";
  fields.role = req.body.fields.role?._id || "";
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
    if (req.body.model === "Department") {
      departmentUpdates(newItem._id.toString(), fields.manager, fields.members);
    }

    const savedItem = await newItem.save();
    res.status(200).json(savedItem);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
