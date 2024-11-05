const Counters = require("../../models/models/Counters");
const Department = require("../../models/models/Department");
const Notifications = require("../../models/models/Notifications");
const Position = require("../../models/models/Position");
const io = require("../../api/node_modules/socket.io-client");
const socket = io("http://localhost:5002");

async function notificationRoutines(
  model,
  target,
  method,
  sourceId,
  notificationList
) {
  try {
    const config = await Notifications.findOne({});
    const counters = await Counters.findOne({});
    let finalTarget = "";

    if (target) {
      target.title
        ? (finalTarget = target.title)
        : target.name
        ? (finalTarget = target.name)
        : target.number
        ? (finalTarget = target.number)
        : (finalTarget = target);
    }

    switch (model) {
      case "User":
        const position = target.position
          ? await Position.findById(target.position)
          : null;

        const department = target.department
          ? await Department.findById(target.department)
          : null;
        socket.emit("notificationToList", {
          finalTarget,
          method,
          item: {
            position: position?.name || "",
            department: department?.name || "",
          },
          sourceId,
          receivers: config[model.toLowerCase()][notificationList],
          label: "Colaborador",
        });
        break;
      case "Customer":
        socket.emit("notificationToList", {
          finalTarget,
          method,
          item: {},
          sourceId,
          receivers: config[model.toLowerCase()][notificationList],
          label: "Cliente",
        });
        break;
      case "Job":
        socket.emit("notificationToList", {
          finalTarget,
          method,
          item: {},
          sourceId,
          receivers: config[model.toLowerCase()][notificationList],
          label: "Job",
        });
        break;
      case "Sale":
        socket.emit("notificationToList", {
          finalTarget: counters[model.toLowerCase()],
          method,
          item: {},
          sourceId,
          receivers: config[model.toLowerCase()][notificationList],
          label: "Venda",
          isFemale: true,
        });
        break;
      case "Department":
        socket.emit("notificationToList", {
          finalTarget,
          method,
          item: {},
          sourceId,
          receivers: config[model.toLowerCase()][notificationList],
          label: "Departamento",
        });
        break;
      case "Group":
        socket.emit("notificationToList", {
          finalTarget,
          method,
          item: {},
          sourceId,
          receivers: config[model.toLowerCase()][notificationList],
          label: "Grupo",
        });
        break;
      case "Service":
        socket.emit("notificationToList", {
          finalTarget,
          method,
          item: {},
          sourceId,
          receivers: config[model.toLowerCase()][notificationList],
          label: "Serviço",
        });
        break;
      case "ServicePlan":
        socket.emit("notificationToList", {
          finalTarget,
          method,
          item: {},
          sourceId,
          receivers: config[model.toLowerCase()][notificationList],
          label: "Plano de Serviços",
        });
        break;

      default:
        break;
    }
  } catch (err) {
    console.error(`Erro na rotina de notificações`, err);
  }
}

module.exports = { notificationRoutines };
