const Department = require("../../models/models/Department");
const Service = require("../../models/models/Service");
const User = require("../../models/models/User");
const models = {
  Client: require("../../models/models/Client"),
  Customer: require("../../models/models/Customer"),
  Department: require("../../models/models/Department"),
  FinanceIncome: require("../../models/models/FinanceIncome"),
  FinanceOutcome: require("../../models/models/FinanceOutcome"),
  Group: require("../../models/models/Group"),
  Job: require("../../models/models/Job"),
  Operator: require("../../models/models/User"),
  Position: require("../../models/models/Position"),
  Product: require("../../models/models/Product"),
  // Project: require("../../models/models/Project"),
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

const swapDepartments = async (sourceItemId, sourceModel, newDepartmentId) => {
  try {
    if (sourceModel === "User") {
      const sourceItem = await User.findById(sourceItemId);
      if (sourceItem) {
        const oldDepartmentId = sourceItem.department;

        if (sourceItem.isManager) {
          sourceItem.department = newDepartmentId;
          await sourceItem.save();

          if (oldDepartmentId) {
            const oldDepartment = await Department.findById(oldDepartmentId);

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

          if (oldDepartmentId) {
            const oldDepartment = await Department.findById(oldDepartmentId);

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
          ""
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

module.exports = { defineModel, swapDepartments };
