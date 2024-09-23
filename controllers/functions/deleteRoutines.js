const Department = require("../../models/models/Department");
const Group = require("../../models/models/Group");
const Position = require("../../models/models/Position");
const Role = require("../../models/models/Role");
const Service = require("../../models/models/Service");
const User = require("../../models/models/User");

async function deleteRoutines(model, sourceId) {
  try {
    switch (model) {
      case "User":
        const user = await User.findById(sourceId);
        if (!user) return;

        const { department: userDepartment, position, role, groups } = user;

        if (userDepartment) {
          const updateField = user.isManager ? "manager" : "members";

          updateField === "manager"
            ? await Department.findByIdAndUpdate(userDepartment, {
                $set: { manager: "" },
              })
            : await Department.findByIdAndUpdate(userDepartment, {
                $pull: { members: user._id.toString() },
              });
        }

        if (position) {
          await Position.findByIdAndUpdate(position, {
            $pull: { members: sourceId },
          });
        }
        if (role) {
          await Role.findByIdAndUpdate(role, { $pull: { members: sourceId } });
        }
        if (groups && groups.length > 0) {
          await Promise.all(
            groups.map((groupId) =>
              Group.findByIdAndUpdate(groupId, { $pull: { members: sourceId } })
            )
          );
        }
        break;

      case "Department":
        const department = await Department.findById(sourceId);
        if (!department) return;

        const { members, manager, services } = department;

        if (manager) {
          await User.findByIdAndUpdate(manager, {
            $set: { department: "" },
          });
        }

        if (members && members.length > 0) {
          await Promise.all(
            members.map((memberId) =>
              User.findByIdAndUpdate(memberId, { $set: { department: "" } })
            )
          );
        }

        if (services && services.length > 0) {
          await Promise.all(
            services.map((serviceId) =>
              Service.findByIdAndUpdate(serviceId, { $set: { department: "" } })
            )
          );
        }
        break;

      case "Service":
        const service = await Service.findById(sourceId);
        if (!service) return;

        const { department: serviceDepartment } = service;

        if (serviceDepartment) {
          await Department.findByIdAndUpdate(serviceDepartment, {
            $pull: { services: sourceId },
          });
        }

        break;

      default:
        break;
    }
  } catch (err) {
    console.error(`Erro na rotina de deleção`, err);
  }
}

module.exports = { deleteRoutines };
