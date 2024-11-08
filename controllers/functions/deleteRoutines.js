const Agenda = require("../../models/models/Agenda");
const Config = require("../../models/models/Config");
const Department = require("../../models/models/Department");
const Group = require("../../models/models/Group");
const Position = require("../../models/models/Position");
const Role = require("../../models/models/Role");
const Service = require("../../models/models/Service");
const User = require("../../models/models/User");
const UserPreferences = require("../../models/models/UserPreferences");

async function deleteRoutines(model, deletedItem, sourceId) {
  try {
    switch (model) {
      case "User":
        const {
          department: userDepartment,
          position,
          role,
          groups,
        } = deletedItem;

        if (userDepartment) {
          const updateField = deletedItem.isManager ? "manager" : "members";

          updateField === "manager"
            ? await Department.findByIdAndUpdate(userDepartment, {
                $set: { manager: "" },
              })
            : await Department.findByIdAndUpdate(userDepartment, {
                $pull: { members: sourceId.toString() },
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

        const agenda = await Agenda.findOne({});
        if (agenda && Array.isArray(agenda.users)) {
          const indexToRemove = agenda.users.findIndex((userMap) =>
            userMap.has(sourceId.toString())
          );
          if (indexToRemove !== -1) {
            agenda.users.splice(indexToRemove, 1);
            await agenda.save();
          }
        }

        break;

      case "Department":
        const department = await Department.findById(sourceId);
        //check this
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
        //check this
        if (!service) return;

        const { department: serviceDepartment } = service;

        if (serviceDepartment) {
          await Department.findByIdAndUpdate(serviceDepartment, {
            $pull: { services: sourceId },
          });
        }

        break;

      case "Group":
        const group = await Group.findById(sourceId);
        //check this
        if (!group) return;

        const { members: groupMembers } = group;

        if (groupMembers && groupMembers.length > 0) {
          await Promise.all(
            groupMembers.map((memberId) =>
              User.findByIdAndUpdate(memberId, { $pull: { groups: sourceId } })
            )
          );
        }
        break;

      case "Role":
        const roleNotifications = await Role.findById(sourceId);
        //check this
        if (!roleNotifications) return;
        //fix this
        // await Config.findOneAndUpdate(
        //   {},
        //   {
        //     $pull: {
        //       "notifications.whenUserIsCreated": sourceId,
        //       "notifications.whenUserIsEdited": sourceId,
        //       "notifications.whenUserIsDeleted": sourceId,
        //     },
        //   }
        // );
        break;

      default:
        break;
    }
  } catch (err) {
    console.error(`Erro na rotina de deleção`, err);
  }
}

module.exports = { deleteRoutines };
