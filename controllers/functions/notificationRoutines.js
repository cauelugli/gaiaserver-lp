const io = require("../../api/node_modules/socket.io-client");
const socket = io("http://localhost:5002");

async function notifyApproverManager(
  receiver,
  model,
  title,
  sourceId,
  idIndexList
) {
  try {
    socket.emit("notifyApproverManager", {
      title: title,
      source: idIndexList?.find((item) => item.id === sourceId)?.name || "",
      receiver: receiver,
      receiverName:
        idIndexList?.find((item) => item.id === receiver)?.name || "",
      model,
      emitter: sourceId,
    });
  } catch (err) {
    console.error(`Erro na rotina de notificações`, err);
  }
}

module.exports = { notifyApproverManager };
