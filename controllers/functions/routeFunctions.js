const Department = require("../../models/models/Department");
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

const userSwapDepartments = async (userId, newDepartmentId) => {
  try {
    const user = await User.findById(userId);
    if (user) {
      const oldDepartmentId = user.department;

      if (user.isManager) {
        user.department = newDepartmentId;
        await user.save();

        if (oldDepartmentId) {
          const oldDepartment = await Department.findById(oldDepartmentId);

          if (oldDepartment) {
            oldDepartment.manager = "";
            await oldDepartment.save();
          }
        }

        const newDepartment = await Department.findById(newDepartmentId);
        if (newDepartment) {
          newDepartment.manager = user._id.toString();
          await newDepartment.save();
        }
      } else {
        user.department = newDepartmentId;
        await user.save();

        if (oldDepartmentId) {
          const oldDepartment = await Department.findById(oldDepartmentId);

          if (oldDepartment) {
            oldDepartment.members = oldDepartment.members.filter(
              (memberId) => memberId.toString() !== userId.toString()
            );
            await oldDepartment.save();
          }
        }

        const newDepartment = await Department.findById(newDepartmentId);

        if (newDepartment) {
          if (!newDepartment.members.includes(userId)) {
            newDepartment.members.push(userId);
          }
          await newDepartment.save();
        }
      }
    } else {
      throw new Error("Usuário não encontrado.");
    }
  } catch (error) {
    throw error;
  }
};

const departmentUpdates = async (departmentId, managerId, members) => {
  try {
    if (managerId) {
      const manager = await User.findById(managerId);
      if (manager) {
        manager.department = departmentId;
        await manager.save();
      }
    }

    await Promise.all(
      members.map(async (memberId) => {
        try {
          const user = await User.findById(memberId);
          if (user) {
            user.department = departmentId;
            await user.save();
          }
        } catch (error) {
          console.log(`Erro ao atualizar o usuário ${memberId}:`, error);
        }
      })
    );
  } catch (error) {
    throw error;
  }
};

module.exports = { defineModel, departmentUpdates, userSwapDepartments };
