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

  try {
    const updatedItem = await Model.findByIdAndUpdate(
      req.body.prevData._id,
      { $set: processedFields },
      { new: true }
    );

    switch (req.body.model) {
      case "User":
        if (processedFields.department !== req.body.prevData.department) {
          mainQueue.add({
            type: "swapDepartments",
            data: {
              userId: req.body.prevData._id.toString(),
              model: req.body.model,
              newDepartment: req.body.fields.department,
              oldDepartment: req.body.prevData.department,
            },
          });
        }

        if (
          processedFields.position !== "" &&
          processedFields.position !== req.body.prevData.position
        ) {
          mainQueue.add({
            type: "swapPositions",
            data: {
              userId: req.body.prevData._id.toString(),
              newPosition: processedFields.position,
              oldPosition: req.body.prevData.position,
            },
          });
        }
        break;

      case "Job":
        if (updatedItem.worker !== req.body.prevData.worker) {
          mainQueue.add({
            type: "swapWorker",
            data: {
              jobId: updatedItem._id.toString(),
              newAssignee: updatedItem.worker,
              oldAssignee: req.body.prevData.worker,
            },
          });
        }
        break;

      default:
        break;
    }

    mainQueue.add({ type: "refreshIdIndexList" });

    res.status(200).json(updatedItem);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
