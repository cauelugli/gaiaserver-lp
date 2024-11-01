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

    const position = target.position
      ? await Position.findById(target.position)
      : null;

    const department = target.department
      ? await Department.findById(target.department)
      : null;

    const userName = target.name ? target.name : target;

    switch (model) {
      case "User":
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

      default:
        break;
    }
  } catch (err) {
    console.error(`Erro na rotina de notificações`, err);
  }
}

module.exports = { notificationRoutines };
