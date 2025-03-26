const express = require("express");
const router = express.Router();
const Log = require("../../models/models/Log");

const { translateLogType } = require("../../controllers/notificationOptions");

const compareData = (prevData, targetData) => {
  const changes = [];
  for (const field in prevData) {
    if (prevData.hasOwnProperty(field)) {
      const prevValue = prevData[field];
      const targetValue = targetData[field];

      if (
        Array.isArray(prevValue) &&
        prevValue.length === 0 &&
        Array.isArray(targetValue) &&
        targetValue.length === 0
      ) {
        continue;
      }

      if (prevValue !== targetValue) {
        changes.push({
          field,
          oldValue: prevValue,
          newValue: targetValue,
        });
      }
    }
  }
  return changes;
};

// Mapas para determinar quais campos incluir no target
const addMappingTable = {
  "Cliente Empresa": ["image", "name", "phone", "mainContactName"],
  "Cliente Pessoa Física": ["image", "name", "phone", "email"],
  Job: ["number", "customer", "service", "scheduledTo"],
  Venda: ["number", "customer", "products", "deliveryScheduledTo"],
  "Entrada de Estoque": ["number", "items"],
  Serviço: ["name", "type", "price"],
  "Plano de Serviço": ["name", "price"],
  Produto: ["name", "buyValue", "sellValue"],
};

router.post("/", async (req, res) => {
  try {
    const { prevData, target, type, label, targetModel } = req.body;

    let logTarget = target;

    if (
      type === "add" ||
      type === "delete" ||
      type === "archive" ||
      type === "unarchive"
    ) {
      logTarget = {};
      const fields = addMappingTable[label];
      if (fields) {
        fields.forEach((field) => {
          if (target[field] !== undefined) {
            logTarget[field] = target[field];
          }
        });
      }
    } else if (type === "edit") {
      logTarget = prevData ? compareData(prevData, target) : [];
    }

    await new Log({
      source: req.body.source,
      target: logTarget,
      label,
      type: translateLogType(type),
      targetModel: targetModel || "",
    }).save();

    res.status(200).json("OK");
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
