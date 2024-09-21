const express = require("express");
const router = express.Router();
const {
  defineModel,
  userSwapDepartments,
} = require("../../controllers/functions/routeFunctions");

// EDIT SMALL ITEM
router.put("/", async (req, res) => {
  const attribute = req.body.targetAttribute;
  const Model = defineModel(req.body.sourceModel);
  if (!Model) {
    console.log("\nmodel not found\n");
    return res.status(400).json({ error: "Modelo inválido" });
  }

  if (req.body.targetAttribute === "department") {
    userSwapDepartments(req.body.sourceId, req.body.newAttributeValue);
  }

  try {
    const updatedItem = await Model.findByIdAndUpdate(
      req.body.sourceId,
      { [attribute]: req.body.newAttributeValue },
      { new: true }
    );

    res.status(200).json(updatedItem);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
