const { defineModel } = require("./routeFunctions");
const Agenda = require("../../models/models/Agenda");
const User = require("../../models/models/User");

const removeMembership = async (userId, model, modelId) => {
  const Model = defineModel(model);
  try {
    const item = await Model.findById(modelId);
    if (item.members.includes(userId)) {
      item.members.pull(userId);
    }
    await item.save();
  } catch (error) {
    console.error(`Erro ao remover o userId no modelo ${model}:`);
    throw error;
  }
};

const removeMembersFromGroup = async (
  itemId,
  model,
  selectedMembers,
  previousMembers
) => {
  if (selectedMembers[0] === 0) {
    return;
  }

  try {
    const removedMembers = previousMembers.filter(
      (memberId) => !selectedMembers.includes(memberId)
    );

    await Promise.all(
      removedMembers.map(async (memberId) => {
        try {
          const user = await User.findById(memberId);
          if (user) {
            switch (model) {
              case "Department":
                user.department = "";
                break;

              case "Group":
                if (user.groups.includes(itemId)) {
                  user.groups.pull(itemId);
                }
                break;

              default:
                console.log(`${model} desconhecido`);
            }

            await user.save();
          }
        } catch (error) {
          console.log(`\nErro ao remover usuário\n`, error);
        }
      })
    );
  } catch (error) {
    throw error;
  }
};

const updateAgendaEvent = async (
  jobId,
  assignee,
  customer,
  service,
  scheduledTo,
  scheduleTime
) => {
  try {
    const agenda = await Agenda.findOne();
    const [day, month, year] = scheduledTo ? scheduledTo.split("/") : [];
    const monthYearKey = `${month}-${year}`;

    // Encontra o índice do designado na lista de usuários
    const userIndex = await agenda.users.findIndex((userMap) =>
      userMap.has(assignee)
    );

    if (userIndex === -1) {
      throw new Error("Designado não encontrado");
    }

    const userMap = agenda.users[userIndex];
    const userAgenda = userMap.get(assignee);

    if (!userAgenda) {
      console.log("Erro: usuário não encontrado na agenda");
      return;
    }

    if (!userAgenda[monthYearKey]) {
      console.log("Erro: mês não encontrado na agenda");
      return;
    }

    const eventIndex = userAgenda[monthYearKey].findIndex(
      (event) =>
        event.jobId === jobId &&
        event.day === day &&
        event.scheduleTime === scheduleTime
    );

    if (eventIndex === -1) {
      console.log("Erro: evento não encontrado na agenda");
      return;
    }

    const eventToUpdate = userAgenda[monthYearKey][eventIndex];
    eventToUpdate.customer = customer;
    eventToUpdate.service = service;
    eventToUpdate.scheduleTime = scheduleTime;

    await Agenda.findOneAndUpdate(
      {},
      { $set: { users: agenda.users } },
      { new: true }
    );
  } catch (err) {
    console.error("Erro ao atualizar evento da agenda do designado", err);
  }
};

const resolveAgendaEvent = async (
  jobId,
  assignee,
  scheduledTo,
  scheduleTime
) => {
  try {
    const agenda = await Agenda.findOne();
    const [day, month, year] = scheduledTo ? scheduledTo.split("/") : [];
    const monthYearKey = `${month}-${year}`;

    // Encontra o índice do designado na lista de usuários
    const userIndex = await agenda.users.findIndex((userMap) =>
      userMap.has(assignee)
    );

    if (userIndex === -1) {
      throw new Error("Designado não encontrado");
    }

    const userMap = agenda.users[userIndex];
    const userAgenda = userMap.get(assignee);

    if (!userAgenda) {
      console.log("Erro: usuário não encontrado na agenda");
      return;
    }

    if (!userAgenda[monthYearKey]) {
      console.log("Erro: mês não encontrado na agenda");
      return;
    }

    const eventIndex = userAgenda[monthYearKey].findIndex(
      (event) =>
        event.jobId === jobId &&
        event.day === day &&
        event.scheduleTime === scheduleTime
    );

    if (eventIndex === -1) {
      console.log("Erro: evento não encontrado na agenda");
      return;
    }

    const eventToUpdate = userAgenda[monthYearKey][eventIndex];
    eventToUpdate.status = "Resolvido";

    await Agenda.findOneAndUpdate(
      {},
      { $set: { users: agenda.users } },
      { new: true }
    );
  } catch (err) {
    console.error("Erro ao atualizar evento da agenda do designado", err);
  }
};

module.exports = {
  removeMembership,
  removeMembersFromGroup,
  updateAgendaEvent,
  resolveAgendaEvent,
};
