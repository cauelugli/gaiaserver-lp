const Config = require("../../models/models/Config");
const Department = require("../../models/models/Department");
const Position = require("../../models/models/Position");
const io = require("../../api/node_modules/socket.io-client");
const socket = io("http://localhost:5002");

async function notificationRoutines(model, target, method, sourceId) {
  try {
    switch (model) {
      case "User":
        const config = await Config.findOne();

        const position = target.position
          ? await Position.findById(target.position)
          : null;

        const department = target.department
          ? await Department.findById(target.department)
          : null;

        const userName = target.name;
        const wsEvent = method === "add" ? "addRoutine" : "";
        const emitterId = sourceId;
        const receivers = config.notifications.whenUserIsCreated;

        if (wsEvent) {
          socket.emit(wsEvent, {
            userName,
            position: position ? position.name : "",
            department: department ? department.name : "",
            emitterId,
            receivers,
            label: "Colaborador",
          });
        }

        break;

      default:
        break;
    }
  } catch (err) {
    console.error(`Erro na rotina de notificações`, err);
  }
}

module.exports = { notificationRoutines };
