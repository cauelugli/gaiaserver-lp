const express = require("express");
const router = express.Router();
const {
  defineModel,
  swapDepartments,
} = require("../../controllers/functions/routeFunctions");

// need to implement notifications and routines here!!!!!
// you lazy shity ass dog

// EDIT SMALL ITEM
router.put("/", async (req, res) => {
  const attribute = req.body.targetAttribute;
  const Model = defineModel(req.body.sourceModel);
  if (!Model) {
    return res.status(400).json({ error: "Modelo não encontrado" });
  }

  if (req.body.targetAttribute === "department") {
    swapDepartments(
      req.body.sourceId,
      req.body.sourceModel,
      req.body.newAttributeValue,
      ""
    );
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
