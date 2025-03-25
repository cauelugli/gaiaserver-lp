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

  // console.log("req.body", req.body);

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

    switch (req.body.model) {
      case "User":
        if (processedFields.department !== prevData.department) {
          mainQueue.add({
            type: "swapDepartments",
            data: {
              userId: req.body.targetId,
              model: req.body.model,
              newDepartment: req.body.fields.department,
              oldDepartment: prevData.department,
            },
          });
        }

        if (
          processedFields.position !== "" &&
          processedFields.position !== prevData.position
        ) {
          mainQueue.add({
            type: "swapPositions",
            data: {
              userId: req.body.targetId,
              newPosition: processedFields.position,
              oldPosition: prevData.position,
            },
          });
        }
        break;

      case "Job":
        if (processedFields.worker !== prevData.worker) {
          // notify instead
          // mainQueue.add({
          //   type: "swapWorker",
          //   data: {
          //     jobId: updatedItem._id.toString(),
          //     newAssignee: updatedItem.worker,
          //     oldAssignee: req.body.prevData.worker,
          //   },
          // });
        }
        break;

      case "Department":
        const areArraysEqual = (arr1, arr2) => {
          if (arr1.length !== arr2.length) return false;
          return (
            arr1.every((item) => arr2.includes(item)) &&
            arr2.every((item) => arr1.includes(item))
          );
        };

        if (
          !areArraysEqual(processedFields.selectedMembers, prevData.members)
        ) {
          const updatedMembers = processedFields.selectedMembers || [];
          const prevMembers = prevData.members || [];

          const addUsers = updatedMembers.filter(
            (member) => !prevMembers.includes(member)
          );

          const removeUsers = prevMembers.filter(
            (member) => !updatedMembers.includes(member)
          );

          mainQueue.add({
            type: "swapMembers",
            data: {
              departmentId: updatedItem._id.toString(),
              addUsers,
              removeUsers,
            },
          });
        }

        if (processedFields.manager !== prevData.manager) {
          mainQueue.add({
            type: "swapManagers",
            data: {
              departmentId: updatedItem._id.toString(),
              newManagerId: processedFields.manager,
              oldManagerId: prevData.manager,
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
    await defineModel("Log").create({
      source: updatedBy,
      target: id,
      label: "Product",
      type: "edit",
    });

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
