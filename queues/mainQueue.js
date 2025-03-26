const io = require("../api/node_modules/socket.io-client");
const socket = io("http://localhost:5002");

const Queue = require("bull");

const {
  translateMethod,
  translateModel,
} = require("../controllers/notificationOptions");

const {
  addCounter,
  addFinanceOutcome,
  addFinanceIncome,
} = require("../controllers/functions/addFunctions");

const {
  addToStock,
  archiveItem,
  removeFromStock,
  resolveItem,
  markAllNotificationAsRead,
  markNotificationAsRead,
  deleteNotification,
} = require("../controllers/functions/actionsFunctions");

const {
  deleteRoutinesClient,
  deleteRoutinesCustomer,
  deleteRoutinesJob,
  deleteRoutinesProduct,
  deleteRoutinesSale,
  deleteRoutinesService,
  deleteRoutinesServicePlan,
  deleteRoutinesStockEntry,
  deleteRoutinesBaseProduct,
} = require("../controllers/functions/deleteRoutines");

const deleteRoutinesFunctions = {
  deleteRoutinesClient,
  deleteRoutinesCustomer,
  deleteRoutinesJob,
  deleteRoutinesProduct,
  deleteRoutinesSale,
  deleteRoutinesService,
  deleteRoutinesServicePlan,
  deleteRoutinesStockEntry,
  deleteRoutinesBaseProduct,
};

const mainQueue = new Queue("mainQueue", {
  redis: { port: 6379, host: "127.0.0.1" },
});

// MAIN PROCESSOR
mainQueue.process(async (job) => {
  const { type, data } = job.data;
  const isAdmin = job.data.isAdmin;

  try {
    switch (type) {
      case "addCounter":
        await handleAddCounter(data);
        break;
      case "addFinanceOutcome":
        await handleFinanceOutcome(data);
        break;
      case "addFinanceIncome":
        await handleFinanceIncome(data);
        break;
      case "archiveItem":
        await handleArchiveItem(data);
        break;
      case "refreshIdIndexList":
        await handleRefreshIdIndexList();
        break;
      case "addUserRoutines":
        await handleAddUserRoutines(data);
        break;
      case "addToStock":
        await handleAddToStock(data);
        break;

      case "deleteSingleItem":
        await handleDeleteSingleItem(data);
        break;
      case "deleteBaseProduct":
        await handleDeleteBaseProduct(data);
        break;
      case "deleteMultipleItems":
        await handleDeleteMultipleItems(data);
        break;

      case "notifyAdmin":
        await handleNotifyAdmin(data, isAdmin);
        break;
      case "markAllNotificationAsRead":
        await handleMarkAllNotificationsAsRead(data);
        break;
      case "markNotificationAsRead":
        await handleMarkNotificationAsRead(data);
        break;
      case "deleteNotification":
        await handleDeleteNotification(data);
        break;
      case "removeFromStock":
        await handleRemoveFromStock(data);
        break;
      case "resolveItem":
        await handleResolveItem(data);
        break;

      default:
        throw new Error(`Tipo de notificação não suportado: ${type}`);
    }

    return true;
  } catch (err) {
    console.error(`Erro ao processar o tipo ${type}: ${err.message}`);
    throw err;
  }
});

// HANDLERS
const handleRefreshIdIndexList = async () => {
  socket.emit("refreshIdIndexList");
};

const handleAddCounter = async (data) => {
  await addCounter(data.itemId, data.model);
};

const handleFinanceOutcome = async (data) => {
  await addFinanceOutcome(data);
};

const handleFinanceIncome = async (data) => {
  await addFinanceIncome(data);
};

const handleArchiveItem = async (data) => {
  await archiveItem(data);
};

const handleAddToStock = async (data) => {
  await addToStock(data.items);
};

const handleRemoveFromStock = async (data) => {
  await removeFromStock(data.items);
};

const handleResolveItem = async (data) => {
  await resolveItem(data);
};

const handleDeleteBaseProduct = async (data) => {
  const { id } = data;
  if (deleteRoutinesFunctions["deleteRoutinesBaseProduct"]) {
    await deleteRoutinesFunctions["deleteRoutinesBaseProduct"](id);
  } else {
    console.error(`Function ${routineFunction} is not defined.`);
  }
};

const handleDeleteSingleItem = async (data) => {
  const { sourceId, model, id } = data;

  const routineFunction = `deleteRoutines${model}`;
  if (deleteRoutinesFunctions[routineFunction]) {
    await deleteRoutinesFunctions[routineFunction](
      model,
      false,
      id,
      sourceId,
      ""
    );
  } else {
    console.error(`Function ${routineFunction} is not defined.`);
  }
};

const handleDeleteMultipleItems = async (data) => {
  const { sourceId, model, ids } = data;

  const routineFunction = `deleteRoutines${model}`;
  if (deleteRoutinesFunctions[routineFunction]) {
    await deleteRoutinesFunctions[routineFunction](
      model,
      true,
      "",
      sourceId,
      ids
    );
  } else {
    console.error(`Function ${routineFunction} is not defined.`);
  }
};

const handleMarkAllNotificationsAsRead = async (data) => {
  await markAllNotificationAsRead(data);
};

const handleMarkNotificationAsRead = async (data) => {
  await markNotificationAsRead(data);
};

const handleDeleteNotification = async (data) => {
  await deleteNotification(data);
};

const handleNotifyAdmin = async (data, isAdmin) => {
  socket.emit("notifyAdmin", {
    target: data,
    method: translateMethod(data.method),
    model: translateModel(data.model),
    isFemaleGender: data.model === "Sale",
    isAdmin: isAdmin,
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
