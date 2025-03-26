const express = require("express");
const router = express.Router();
const mainQueue = require("../../queues/mainQueue");

const {
  defineModel,
  parseReqFields,
} = require("../../controllers/functions/routeFunctions");

// EDIT ITEM
router.put("/", async (req, res) => {
  const { name } = req.body;

  const Model = defineModel(req.body.model);
  const Log = defineModel("Log");

  if (!Model) {
    console.log("\nmodel not found\n");
    return res.status(400).json({ error: "Modelo inválido" });
  }

  if (req.body.model === "Customer") {
    const existingNameUser = await Model.findOne({ name });
    if (existingNameUser) {
      return res.status(422).json({ error: "Nome de Cliente já cadastrado" });
    }
  }

  const processedFields = parseReqFields(req.body.fields, req.body);

  // const createdLog = await new Log({
  //   source: req.body.sourceId,
  //   target: logTarget,
  //   label:req.body.model||"",
  //   type: "edit",
  //   targetModel: req.body.model || "",
  // }).save();

  try {
    const prevData = await Model.findById(req.body.targetId);
    const updatedItem = await Model.findByIdAndUpdate(
      req.body.targetId,
      { $set: processedFields },
      { new: true }
    );

    mainQueue.add({ type: "refreshIdIndexList" });

    res.status(200).json(updatedItem);
  } catch (err) {
    console.log("createdLog", createdLog._id.toString());
    console.log(err);
    res.status(500).json(err);
  }
});

// EDIT BASE PRODUCT
router.post("/baseProduct", async (req, res) => {
  try {
    const { id, type, fields, updatedBy } = req.body;

    const updatedProduct = await defineModel("Product").findByIdAndUpdate(
      id,
      { type, fields, updatedBy, updatedAt: Date.now() },
      { new: true }
    );

    // Registrar no log
    // await defineModel("Log").create({
    //   source: updatedBy,
    //   target: id,
    //   label: "Product",
    //   type: "edit",
    // });

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
