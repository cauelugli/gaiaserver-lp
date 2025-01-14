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

  // same name already registered verification
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
        mainQueue.add({
          type: "swapDepartments",
          data: {
            prevDataId: req.body.prevData._id.toString(),
            model: req.body.model,
            newDepartment: req.body.fields.department,
            oldDepartment: req.body.prevData.department,
          },
        });

        mainQueue.add({
          type: "swapPositions",
          data: {
            prevDataId: req.body.prevData._id.toString(),
            newPosition: req.body.fields.position,
            oldPosition: req.body.prevData.position,
          },
        });
        break;

      case "Job":
        mainQueue.add({
          type: "swapDepartments",
          data: {
            prevDataId: req.body.prevData._id.toString(),
            model: req.body.model,
            newDepartment: req.body.fields.department,
            oldDepartment: req.body.prevData.department,
          },
        });
        break;

      default:
        break;
    }

    if (req.body.fields.members) {
      //insertMembersToGroup
      // await insertMembersToGroup(
      //   updatedItem._id.toString(),
      //   req.body.model,
      //   selectedMembers
      // );
      // await removeMembersFromGroup(
      //   updatedItem._id.toString(),
      //   req.body.model,
      //   selectedMembers,
      //   previousMembers
      // );
    }

    res.status(200).json(updatedItem);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
