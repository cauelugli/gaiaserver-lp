const io = require("../../api/node_modules/socket.io-client");
const socket = io("http://localhost:5002");

async function notifyApproverManager(
  receiver,
  model,
  title,
  sourceId,
) {
  try {
    socket.emit("notifyApproverManager", {
      title: title,
      source: sourceId,
      receiver: receiver,
      model,
    });
  } catch (err) {
    console.error(`Erro na rotina de notificações`, err);
  }
}

module.exports = { notifyApproverManager };
