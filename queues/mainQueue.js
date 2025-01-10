const io = require("../api/node_modules/socket.io-client");
const socket = io("http://localhost:5002");

const Queue = require("bull");
const {
  translateMethod,
  translateModel,
} = require("../controllers/notificationOptions");

const {
  insertMembership,
  insertMembersToGroup,
} = require("../controllers/functions/updateRoutines");

const {
  addCounter,
  addToAssigneeAgenda,
  addToStock,
} = require("../controllers/functions/addRoutines");
const {
  checkNewStockEntryDefaultStatus,
} = require("../controllers/functions/checkFunctions");

const mainQueue = new Queue("mainQueue", {
  redis: { port: 6379, host: "127.0.0.1" },
});

// MAIN PROCESSOR
mainQueue.process(async (job) => {
  const { type, data } = job.data;
  const finalList = job.data.notificationList;
  const isAdmin = job.data.isAdmin;

  try {
    switch (type) {
      case "addCounter":
        await handleAddCounter(data);
        break;
      case "addItem":
        // await handleAddItem(data, isAdmin);
        break;
      case "addToAssigneeAgenda":
        await handleAddToAssigneeAgenda(data);
        break;
      case "addToStock":
        await handleAddToStock(data);
        break;
      case "checkNewStockEntryDefaultStatus":
        await handleCheckNewStockEntryDefaultStatus(data);
        break;
      case "insertMembership":
        await handleInsertMembership(data);
        break;
      case "insertMembersToGroup":
        await handleInsertMembersToGroup(data);
        break;
      case "notificationToList":
        await handleNotificationToList(data, isAdmin);
        break;
      case "notifyAdmin":
        await handleNotifyAdmin(data, isAdmin);
        break;
      case "notifyAssignee":
        await handleNotifyAssignee(data);
        break;
      case "notifyStockManagerToBuyProduct":
        await handleNotifyStockManagerToBuyProduct(data, isAdmin);
        break;
      case "productIsCreated":
        await handleProductIsCreated(data, finalList);
        break;

      default:
        throw new Error(`Tipo de notificação não suportado: ${type}`);
    }

    return true;
  } catch (err) {
    console.error(
      `Erro ao processar notificação do tipo ${type}: ${err.message}`
    );
    throw err;
  }
});

// HANDLERS
const handleNotificationToList = async (data, isAdmin) => {
  let finalTarget = "";

  if (data.target) {
    data.target.title
      ? (finalTarget = data.target.title)
      : data.target.name
      ? (finalTarget = data.target.name)
      : data.target.number
      ? (finalTarget = data.target.number)
      : (finalTarget = data.target);
  }
  socket.emit("notificationToList", {
    finalTarget,
    method: data.method,
    item: data.item,
    sourceId: data.sourceId,
    receivers: data.notificationList,
    label: translateModel(data.model),
    isFemale: data.model === "Sale" ? true : false,
    isAdmin,
  });
};

const handleAddCounter = async (data) => {
  await addCounter(data.itemId, data.model);
};

const handleAddToAssigneeAgenda = async (data) => {
  await addToAssigneeAgenda(
    data.scheduledTo,
    data.scheduleTime,
    data.worker,
    data.itemId,
    data.service,
    data.customer
  );
};

const handleAddToStock = async (data) => {
  await addToStock(data.items);
};

const handleCheckNewStockEntryDefaultStatus = async (data) => {
  console.log("handleCheckNewStockEntryDefaultStatus data", data);
  await checkNewStockEntryDefaultStatus(data);
};

const handleInsertMembership = async (data) => {
  await insertMembership(data.id, data.role);
};

const handleInsertMembersToGroup = async (data) => {
  await insertMembersToGroup(data.id, data.model, data.members);
};

const handleNotifyAdmin = async (data, isAdmin) => {
  socket.emit("notifyAdmin", {
    target: data,
    sourceId: data.createdBy,
    method: translateMethod(data.method),
    model: translateModel(data.model),
    isFemaleGender: data.model === "Sale",
    isAdmin: isAdmin,
  });
};

const handleNotifyAssignee = async (data) => {
  socket.emit("notifyAssignee", {
    target: data.target,
    sourceId: data.sourceId,
    receiver: data.receiver,
    receiverName: data.receiverName,
    label: data.label,
  });
};

const handleNotifyStockManagerToBuyProduct = async (data, isAdmin) => {
  socket.emit("notifyStockManagerToBuyProduct", {
    receiver: data.receiver,
    receiverName: data.receiverName,
    emitterName: data.emitterName,
    product: data.product,
    isAdmin,
  });
};

const handleProductIsCreated = async (data, list) => {
  const { name, type, createdBy } = data;

  socket.emit("notificationToList", {
    finalTarget: `do tipo ${type}: "${name}"`,
    method: "add",
    emitterId: createdBy,
    receivers: list,
    label: "Produto",
  });
};

// MONITORING (DEBUG)
// mainQueue.on("completed", (job) => {
//   console.log(`Tarefa ${job.id} concluída com sucesso.`);
// });
// mainQueue.on("failed", (job, err) => {
//   console.error(`Tarefa ${job.id} falhou: ${err.message}`);
// });
console.log("Worker Server running on port 6379 and waiting for jobs");

module.exports = mainQueue;
