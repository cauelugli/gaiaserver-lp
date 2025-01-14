const Agenda = require("../../models/models/Agenda");
const Config = require("../../models/models/Config");
const Department = require("../../models/models/Department");
const Group = require("../../models/models/Group");
const Position = require("../../models/models/Position");
const Role = require("../../models/models/Role");
const Service = require("../../models/models/Service");
const User = require("../../models/models/User");
const UserPreferences = require("../../models/models/UserPreferences");

async function deleteRoutinesDepartment(model, deletedItem, sourceId) {
  try {
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
  } catch (err) {
    console.error(`Erro na rotina de deleção`, err);
  }
}

async function deleteRoutinesGroup(model, deletedItem, sourceId) {
  try {
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
  } catch (err) {
    console.error(`Erro na rotina de deleção`, err);
  }
}

async function deleteRoutinesJob(model, deletedItem, sourceId) {
  try {
    if (deletedItem.scheduleTime) {
      try {
        const assignee = deletedItem.worker || deletedItem.seller;
        const scheduledTo = deletedItem.scheduledTo;
        const [day, month, year] = scheduledTo.split("/");
        const scheduleKey = `${month}-${year}`;

        const agenda = await Agenda.findOne({});
        if (!agenda || !Array.isArray(agenda.users)) {
          console.log("Agenda não encontrada ou inválida");
        }

        const userEntryIndex = agenda.users.findIndex((userMap) =>
          userMap.has(assignee.toString())
        );

        if (userEntryIndex === -1) {
          console.log("Usuário não encontrado na agenda");
        }

        const userMap = agenda.users[userEntryIndex];
        const userJobsByMonth = userMap.get(assignee.toString());

        if (userJobsByMonth && Array.isArray(userJobsByMonth[scheduleKey])) {
          const jobIndex = userJobsByMonth[scheduleKey].findIndex(
            (job) => job.jobId === sourceId.toString()
          );

          if (jobIndex !== -1) {
            userJobsByMonth[scheduleKey].splice(jobIndex, 1);
            userMap.set(assignee.toString(), userJobsByMonth);
            agenda.users[userEntryIndex] = userMap;
            await agenda.save();
          } else {
            console.log(
              `Job ${sourceId} não encontrado na lista do mês/ano ${scheduleKey}`
            );
          }
        } else {
          console.log(
            `Nenhum job encontrado para o usuário no mês/ano ${scheduleKey}`
          );
        }
      } catch (err) {
        console.error(`Erro ao remover job da agenda`);
      }
    }
  } catch (err) {
    console.error(`Erro na rotina de deleção`, err);
  }
}

async function deleteRoutinesRole(model, deletedItem, sourceId) {
  try {
    //check this
    const roleNotifications = await Role.findById(sourceId);
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
  } catch (err) {
    console.error(`Erro na rotina de deleção`, err);
  }
}

async function deleteRoutinesService(model, deletedItem, sourceId) {
  try {
    const service = await Service.findById(sourceId);
    //check this
    if (!service) return;

    const { department: serviceDepartment } = service;

    if (serviceDepartment) {
      await Department.findByIdAndUpdate(serviceDepartment, {
        $pull: { services: sourceId },
      });
    }
  } catch (err) {
    console.error(`Erro na rotina de deleção`, err);
  }
}

async function deleteRoutinesUser(deletedItem, sourceId) {
  try {
    const { department, position, role, groups } = deletedItem;

    if (department) {
      const updateField = deletedItem.isManager ? "manager" : "members";

      updateField === "manager"
        ? await Department.findByIdAndUpdate(department, {
            $set: { manager: "" },
          })
        : await Department.findByIdAndUpdate(department, {
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

    await UserPreferences.deleteOne({ userId: sourceId.toString() });
  } catch (err) {
    console.error(`Erro na rotina de deleção`, err);
  }
}

module.exports = {
  deleteRoutinesDepartment,
  deleteRoutinesGroup,
  deleteRoutinesJob,
  deleteRoutinesRole,
  deleteRoutinesService,
  deleteRoutinesUser,
};
