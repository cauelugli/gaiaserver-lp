const io = require("../api/node_modules/socket.io-client");
const socket = io("http://localhost:5002");

const Queue = require("bull");

const {
  translateMethod,
  translateModel,
} = require("../controllers/notificationOptions");

const {
  addCounter,
  addOperator,
  addManagerToDepartment,
  addServiceToDepartment,
  addToAssigneeAgenda,
  addUserRoutines,
  insertMembership,
  insertMembersToGroup,
} = require("../controllers/functions/addFunctions");

const {
  checkNewStockEntryDefaultStatus,
} = require("../controllers/functions/checkFunctions");

const {
  addToStock,
  approveRequest,
  removeFromStock,
  requestApproval,
} = require("../controllers/functions/actionsFunctions");

const {
  deleteRoutinesClient,
  deleteRoutinesCustomer,
  deleteRoutinesDepartment,
  deleteRoutinesGroup,
  deleteRoutinesJob,
  deleteRoutinesOperator,
  deleteRoutinesPosition,
  deleteRoutinesRole,
  deleteRoutinesSale,
  deleteRoutinesService,
  deleteRoutinesServicePlan,
  deleteRoutinesStockEntry,
  deleteRoutinesUser,
} = require("../controllers/functions/deleteRoutines");

const {
  swapDepartments,
  swapPositions,
  swapSeller,
  swapWorker,
} = require("../controllers/functions/swapFunctions");

const deleteRoutinesFunctions = {
  deleteRoutinesClient,
  deleteRoutinesCustomer,
  deleteRoutinesDepartment,
  deleteRoutinesGroup,
  deleteRoutinesJob,
  deleteRoutinesOperator,
  deleteRoutinesPosition,
  deleteRoutinesRole,
  deleteRoutinesSale,
  deleteRoutinesService,
  deleteRoutinesServicePlan,
  deleteRoutinesStockEntry,
  deleteRoutinesUser,
};

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
      case "addOperator":
        await handleOperator(data);
        break;
      case "addUserRoutines":
        await handleAddUserRoutines(data);
        break;
      case "addToAssigneeAgenda":
        await handleAddToAssigneeAgenda(data);
        break;
      case "addToStock":
        await handleAddToStock(data);
        break;
      case "addManagerToDepartment":
        await handleAddManagerToDepartment(data);
        break;
      case "addServiceToDepartment":
        await handleAddServiceToDepartment(data);
        break;
      case "approveRequest":
        await handleApproveRequest(data);
        break;
      case "checkNewStockEntryDefaultStatus":
        await handleCheckNewStockEntryDefaultStatus(data);
        break;
      case "deleteSingleItem":
        await handleDeleteSingleItem(data);
        break;
      case "deleteMultipleItems":
        await handleDeleteMultipleItems(data);
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
      case "notifyApproverManager":
        await handleNotifyApproverManager(data, isAdmin);
        break;
      case "requestApproval":
        await handleRequestApproval(data, isAdmin);
        break;
      case "notifyAssignee":
        await handleNotifyAssignee(data);
        break;
      case "notifyNewConfiguredUser":
        await handleNotifyNewConfiguredUser(data);
        break;
      case "notifyRequester":
        await handleNotifyRequester(data);
        break;
      case "notifyStockManagerToBuyProduct":
        await handleNotifyStockManagerToBuyProduct(data, isAdmin);
        break;
      case "productIsCreated":
        await handleProductIsCreated(data, finalList);
        break;
      case "removeFromStock":
        await handleRemoveFromStock(data);
        break;
      case "swapDepartments":
        await handleSwapDepartments(data);
        break;
      case "swapPositions":
        await handleSwapPositions(data);
        break;
      case "swapWorker":
        await handleSwapWorker(data);
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

const handleAddManagerToDepartment = async (data) => {
  await addManagerToDepartment(data.managerId, data.departmentId);
};

const handleAddServiceToDepartment = async (data) => {
  await addServiceToDepartment(data.serviceId, data.departmentId);
};

const handleAddUserRoutines = async (data) => {
  await addUserRoutines(data.model, data.item);
};

const handleOperator = async (data) => {
  await addOperator(data);
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

const handleApproveRequest = async (data) => {
  await approveRequest(data);
};

const handleRemoveFromStock = async (data) => {
  await removeFromStock(data.items);
};

const handleCheckNewStockEntryDefaultStatus = async (data) => {
  await checkNewStockEntryDefaultStatus(data);
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

const handleNotifyApproverManager = async (data) => {
  socket.emit("notifyApproverManager", {
    title: data.item,
    source: data.requestedBy || "admin",
    receiver: data.requestsApproverManager,
    model: data.model,
  });
};

const handleRequestApproval = async (data) => {
  await requestApproval(data);
};

const handleNotifyAssignee = async (data) => {
  socket.emit("notifyAssignee", {
    target: data.target,
    sourceId: data.sourceId,
    receiver: data.receiver,
    label: data.label,
  });
};

const handleNotifyNewConfiguredUser = async (data) => {
  socket.emit("notifyNewConfiguredUser", {
    receiver: data.receiver,
    configuration: data.configuration,
  });
};

const handleNotifyRequester = async (data) => {
  socket.emit("notifyRequester", {
    target: data.target,
    receiver: data.receiver,
    manager: data.manager,
    model: data.model,
  });
};

const handleNotifyStockManagerToBuyProduct = async (data, isAdmin) => {
  socket.emit("notifyStockManagerToBuyProduct", {
    receiver: data.receiver,
    requester: data.requester,
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

const handleSwapWorker = async (data) => {
  const { jobId, newAssignee, oldAssignee } = data;
  await swapWorker(jobId, newAssignee, oldAssignee);
};

const handleSwapDepartments = async (data) => {
  const { prevDataId, model, newDepartment, oldDepartment } = data;

  await swapDepartments(prevDataId, model, newDepartment, oldDepartment);
};

const handleSwapPositions = async (data) => {
  const { prevDataId, newPosition, oldPosition } = data;

  await swapPositions(prevDataId, newPosition, oldPosition);
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
