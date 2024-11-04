const Notifications = require("../../models/models/Notifications");
const Department = require("../../models/models/Department");
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
    let userName = "";

    if (target) {
      target.title
        ? (userName = target.title)
        : target.name
        ? (userName = target.name)
        : target.number
        ? (userName = target.number)
        : (userName = target);
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
          userName,
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
          userName,
          method,
          item: {},
          sourceId,
          receivers: config[model.toLowerCase()][notificationList],
          label: "Cliente",
        });
        break;
      case "Job":
        socket.emit("notificationToList", {
          userName,
          method,
          item: {},
          sourceId,
          receivers: config[model.toLowerCase()][notificationList],
          label: "Job",
        });
        break;
      case "Sale":
        socket.emit("notificationToList", {
          userName,
          method,
          item: {},
          sourceId,
          receivers: config[model.toLowerCase()][notificationList],
          label: "Venda",
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
