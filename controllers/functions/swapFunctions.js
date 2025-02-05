const { default: axios } = require("axios");
const Department = require("../../models/models/Department");
const Job = require("../../models/models/Job");
const Position = require("../../models/models/Position");
const Role = require("../../models/models/Role");
const Sale = require("../../models/models/Sale");
const Service = require("../../models/models/Service");
const User = require("../../models/models/User");

const swapDepartments = async (
  userId,
  model,
  newDepartmentId,
  previousDepartmentId
) => {
  try {
    if (model === "User") {
      const user = await User.findById(userId);
      if (user) {
        if (user.isManager) {
          user.department = newDepartmentId;
          await user.save();

          if (previousDepartmentId) {
            const oldDepartment = await Department.findById(
              previousDepartmentId
            );

            if (oldDepartment) {
              oldDepartment.manager = "";
              await oldDepartment.save();
            }
          }

          const newDepartment = await Department.findById(newDepartmentId);
          if (newDepartment) {
            newDepartment.manager = userId;
            await newDepartment.save();
          }
        } else {
          if (previousDepartmentId) {
            const oldDepartment = await Department.findById(
              previousDepartmentId
            );

            if (oldDepartment) {
              await oldDepartment.updateOne({
                $pull: { members: userId },
              });
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
      }
    }
    if (model === "Service") {
      // const sourceItem = await Service.findById(sourceItemId);
      // if (sourceItem) {
      //   const oldDepartment = await Department.findById(sourceItem.department);
      //   if (oldDepartment) {
      //     if (oldDepartment.services.includes(sourceItemId)) {
      //       oldDepartment.services.pull(sourceItemId);
      //       await oldDepartment.save();
      //     }
      //   } else {
      //     ("");
      //   }
      //   const newDepartment = await Department.findById(newDepartmentId);
      //   if (newDepartment) {
      //     if (!newDepartment.services.includes(sourceItemId)) {
      //       newDepartment.services.push(sourceItemId);
      //       await newDepartment.save();
      //     }
      //   }
      // }
    }
  } catch (error) {
    throw error;
  }
};

const swapPositions = async (userId, newPositionId, oldPositionId) => {
  try {
    const user = await User.findById(userId);
    if (user) {
      const oldPosition = await Position.findById(oldPositionId);
      if (oldPosition) {
        await oldPosition.updateOne({
          $pull: { members: userId },
        });
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

module.exports = {
  swapDepartments,
  swapPositions,
  swapRoles,
};
