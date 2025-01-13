const Department = require("../../models/models/Department");
const Position = require("../../models/models/Position");
const Role = require("../../models/models/Role");
const Service = require("../../models/models/Service");
const User = require("../../models/models/User");

const models = {
  Agenda: require("../../models/models/Agenda"),
  Client: require("../../models/models/Client"),
  Customer: require("../../models/models/Customer"),
  Department: require("../../models/models/Department"),
  FinanceIncome: require("../../models/models/FinanceIncome"),
  FinanceOutcome: require("../../models/models/FinanceOutcome"),
  Group: require("../../models/models/Group"),
  Job: require("../../models/models/Job"),
  Notifications: require("../../models/models/Notifications"),
  Operator: require("../../models/models/User"),
  Position: require("../../models/models/Position"),
  Product: require("../../models/models/Product"),
  Quote: require("../../models/models/Quote"),
  RecentActivity: require("../../models/models/RecentActivity"),
  Role: require("../../models/models/Role"),
  Sale: require("../../models/models/Sale"),
  Service: require("../../models/models/Service"),
  ServicePlan: require("../../models/models/ServicePlan"),
  StockEntry: require("../../models/models/StockEntry"),
  User: require("../../models/models/User"),
};

function defineModel(model) {
  return models[model] || null;
}

const swapDepartments = async (
  sourceItemId,
  sourceModel,
  newDepartmentId,
  previousDepartment
) => {
  try {
    if (sourceModel === "User") {
      const sourceItem = await User.findById(sourceItemId);
      if (sourceItem) {
        if (sourceItem.isManager) {
          sourceItem.department = newDepartmentId;
          await sourceItem.save();

          if (previousDepartment) {
            const oldDepartment = await Department.findById(previousDepartment);

            if (oldDepartment) {
              oldDepartment.manager = "";
              await oldDepartment.save();
            }
          }

          const newDepartment = await Department.findById(newDepartmentId);
          if (newDepartment) {
            newDepartment.manager = sourceItem._id.toString();
            await newDepartment.save();
          }
        } else {
          sourceItem.department = newDepartmentId;
          await sourceItem.save();

          if (previousDepartment) {
            const oldDepartment = await Department.findById(previousDepartment);

            if (oldDepartment) {
              oldDepartment.members = oldDepartment.members.filter(
                (memberId) => memberId.toString() !== sourceItemId.toString()
              );
              await oldDepartment.save();
            }
          }

          const newDepartment = await Department.findById(newDepartmentId);

          if (newDepartment) {
            if (!newDepartment.members.includes(sourceItemId)) {
              newDepartment.members.push(sourceItemId);
            }
            await newDepartment.save();
          }
        }
      }
    }
    if (sourceModel === "Service") {
      const sourceItem = await Service.findById(sourceItemId);
      if (sourceItem) {
        const oldDepartment = await Department.findById(sourceItem.department);
        if (oldDepartment) {
          if (oldDepartment.services.includes(sourceItemId)) {
            oldDepartment.services.pull(sourceItemId);
            await oldDepartment.save();
          }
        } else {
          ("");
        }

        const newDepartment = await Department.findById(newDepartmentId);
        if (newDepartment) {
          if (!newDepartment.services.includes(sourceItemId)) {
            newDepartment.services.push(sourceItemId);
            await newDepartment.save();
          }
        }
      }
    }
  } catch (error) {
    throw error;
  }
};

const swapPositions = async (userId, newPositionId, oldPositionId) => {
  if (oldPositionId !== newPositionId) {
    try {
      const user = await User.findById(userId);
      if (user) {
        const oldPosition = await Position.findById(oldPositionId);

        if (oldPosition) {
          oldPosition.members = oldPosition.members.filter(
            (memberId) => memberId.toString() !== userId.toString()
          );
          await oldPosition.save();
        }

        const newPosition = await Position.findById(newPositionId);
        if (newPosition) {
          if (!newPosition.members.includes(userId)) {
            newPosition.members.push(userId);
          }
          await newPosition.save();
        }
      }
    } catch (error) {
      throw error;
    }
  }
};

const swapRoles = async (userId, newRoleId, oldRoleId) => {
  if (newRoleId !== oldRoleId) {
    try {
      const user = await User.findById(userId);
      if (user) {
        const oldRole = await Role.findById(oldRoleId);

        if (oldRole) {
          oldRole.members = oldRole.members.filter(
            (memberId) => memberId.toString() !== userId.toString()
          );
          await oldRole.save();
        }

        const newRole = await Role.findById(newRoleId);
        if (newRole) {
          if (!newRole.members.includes(userId)) {
            newRole.members.push(userId);
          }
          await newRole.save();
        }
      }
    } catch (error) {
      throw error;
    }
  }
};

const parseReqFields = function (fields, reqBody) {
  return {
    manager: fields.manager?._id || reqBody.manager?._id || "",
    members: (fields.members || reqBody.members || []).map(
      (member) => member._id || member
    ),
    department: fields.department?._id || reqBody.department?._id || "",
    position: fields.position?._id || reqBody.position?._id || "",
    role: fields.role?._id || reqBody.role?._id || "",
    selectedMembers: fields.selectedMembers || reqBody.selectedMembers || [],
    image: fields.image || reqBody.image || "",
    isManager: fields.isManager || reqBody.isManager || false,
    createdBy: fields.createdBy || reqBody.createdBy || "",
    products: fields.selectedProducts || reqBody.selectedProducts || [],
    price:
      fields.label === "Plano de Serviços"
        ? parseFloat(
            fields.finalPrice === 0 ? fields.price : fields.finalPrice
          ) ||
          parseFloat(
            reqBody.finalPrice === 0 ? reqBody.price : reqBody.finalPrice
          ) ||
          0
        : parseFloat(fields.price) || parseFloat(reqBody.price) || 0,
    services: fields.services || reqBody.services || [],
    ...fields,
  };
};

module.exports = {
  defineModel,
  swapDepartments,
  swapPositions,
  swapRoles,
  parseReqFields,
};
