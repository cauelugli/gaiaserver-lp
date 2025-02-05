const Agenda = require("../../models/models/Agenda");
const UserPreferences = require("../../models/models/UserPreferences");

const { defineModel } = require("../../controllers/functions/routeFunctions");

async function deleteRoutinesClient(
  model,
  isMultiple,
  deletedItem,
  sourceId,
  ids
) {
  const Model = defineModel(model);

  if (!Model) {
    console.log("\nModel not found\n");
    return res.status(400).json({ error: "Modelo inválido" });
  }
  try {
    const itemsToDelete = isMultiple ? ids : [deletedItem];

    await Promise.all(
      itemsToDelete.map(async (id) => {
        await Model.findByIdAndDelete(id);
      })
    );

    // notify that sourceId made this
  } catch (err) {
    console.error("Erro na rotina de deleção", err);
  }
}

async function deleteRoutinesCustomer(
  model,
  isMultiple,
  deletedItem,
  sourceId,
  ids
) {
  const Model = defineModel(model);

  if (!Model) {
    console.log("\nModel not found\n");
    return res.status(400).json({ error: "Modelo inválido" });
  }
  try {
    const itemsToDelete = isMultiple ? ids : [deletedItem];

    await Promise.all(
      itemsToDelete.map(async (id) => {
        await Model.findByIdAndDelete(id);
      })
    );

    // notify that sourceId made this
  } catch (err) {
    console.error("Erro na rotina de deleção", err);
  }
}

async function deleteRoutinesDepartment(
  model,
  isMultiple,
  deletedItem,
  sourceId,
  ids
) {
  const Model = defineModel(model);

  if (!Model) {
    console.log("\nModel not found\n");
    return res.status(400).json({ error: "Modelo inválido" });
  }
  try {
    const itemsToDelete = isMultiple ? ids : [deletedItem];

    await Promise.all(
      itemsToDelete.map(async (id) => {
        const deletedItem = await Model.findByIdAndDelete(id);

        if (deletedItem) {
          const { members, manager, services } = deletedItem;

          if (manager) {
            await defineModel("User").findByIdAndUpdate(manager, {
              $set: { department: "" },
            });
          }

          if (members && members.length > 0) {
            await Promise.all(
              members.map((memberId) =>
                defineModel("User").findByIdAndUpdate(memberId, {
                  $set: { department: "" },
                })
              )
            );
          }

          if (services && services.length > 0) {
            await Promise.all(
              services.map((serviceId) =>
                defineModel("Service").findByIdAndUpdate(serviceId, {
                  $set: { department: "" },
                })
              )
            );
          }
        }
      })
    );

    // notify that sourceId made this
  } catch (err) {
    console.error("Erro na rotina de deleção", err);
  }
}

async function deleteRoutinesGroup(
  model,
  isMultiple,
  deletedItem,
  sourceId,
  ids
) {
  const Model = defineModel(model);

  if (!Model) {
    console.log("\nModel not found\n");
    return res.status(400).json({ error: "Modelo inválido" });
  }
  try {
    const itemsToDelete = isMultiple ? ids : [deletedItem];

    await Promise.all(
      itemsToDelete.map(async (id) => {
        const deletedItem = await Model.findByIdAndDelete(id);

        if (deletedItem) {
          const { members } = deletedItem;

          if (members && members.length > 0) {
            await Promise.all(
              members.map((memberId) =>
                defineModel("User").findByIdAndUpdate(memberId, {
                  $pull: { groups: deletedItem._id.toSting() },
                })
              )
            );
          }
        }
      })
    );

    // notify that sourceId made this
  } catch (err) {
    console.error("Erro na rotina de deleção", err);
  }
}

async function deleteRoutinesJob(
  model,
  isMultiple,
  deletedItem,
  sourceId,
  ids
) {
  const Model = defineModel(model);

  if (!Model) {
    console.log("\nModel not found\n");
    return res.status(400).json({ error: "Modelo inválido" });
  }

  try {
    const itemsToDelete = isMultiple ? ids : [deletedItem];

    await Promise.all(
      itemsToDelete.map(async (id) => {
        const item = await Model.findByIdAndDelete(id);

        if (item && item.scheduleTime) {
          try {
            const assignee = item.worker || item.seller;
            const scheduledTo = item.scheduledTo;
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

            if (
              userJobsByMonth &&
              Array.isArray(userJobsByMonth[scheduleKey])
            ) {
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
            console.error("Erro ao remover job da agenda");
          }
        }
      })
    );
  } catch (err) {
    console.error("Erro na rotina de deleção", err);
  }
}

async function deleteRoutinesOperator(
  model,
  isMultiple,
  deletedItem,
  sourceId,
  ids
) {
  const Model = defineModel(model);

  if (!Model) {
    console.log("\nModel not found\n");
    return res.status(400).json({ error: "Modelo inválido" });
  }
  try {
    const itemsToDelete = isMultiple ? ids : [deletedItem];

    await Promise.all(
      itemsToDelete.map(async (id) => {
        const operator = await defineModel("User").findById(id);
        const originalRole = operator.role;

        await defineModel("User").findByIdAndUpdate(
          id,
          {
            $set: { username: "", password: "", role: "", alreadyLogin: false },
          },
          { new: true }
        );

        await defineModel("Role").findByIdAndUpdate(originalRole, {
          $pull: { members: operator._id.toString() },
        });
      })
    );

    // notify that sourceId made this
  } catch (err) {
    console.error("Erro na rotina de deleção", err);
  }
}

async function deleteRoutinesPosition(
  model,
  isMultiple,
  deletedItem,
  sourceId,
  ids
) {
  const Model = defineModel(model);

  if (!Model) {
    console.log("\nModel not found\n");
    return res.status(400).json({ error: "Modelo inválido" });
  }
  try {
    const itemsToDelete = isMultiple ? ids : [deletedItem];

    await Promise.all(
      itemsToDelete.map(async (id) => {
        const deletedItem = await Model.findByIdAndDelete(id);

        if (deletedItem) {
          const { members } = deletedItem;
          if (members && members.length > 0) {
            await Promise.all(
              members.map((memberId) =>
                defineModel("User").findByIdAndUpdate(memberId, {
                  $set: { position: "" },
                })
              )
            );
          }
        }
      })
    );

    // notify that sourceId made this
  } catch (err) {
    console.error("Erro na rotina de deleção", err);
  }
}

async function deleteRoutinesRole(
  model,
  isMultiple,
  deletedItem,
  sourceId,
  ids
) {
  const Model = defineModel(model);

  if (!Model) {
    console.log("\nModel not found\n");
    return res.status(400).json({ error: "Modelo inválido" });
  }
  try {
    const itemsToDelete = isMultiple ? ids : [deletedItem];

    await Promise.all(
      itemsToDelete.map(async (id) => {
        const deletedItem = await Model.findByIdAndDelete(id);

        if (deletedItem) {
          const { members } = deletedItem;

          if (members && members.length > 0) {
            await Promise.all(
              members.map((memberId) =>
                defineModel("User").findByIdAndUpdate(memberId, {
                  $set: { role: "" },
                })
              )
            );
          }
        }
      })
    );

    // notify that sourceId made this
  } catch (err) {
    console.error("Erro na rotina de deleção", err);
  }
}

async function deleteRoutinesSale(
  model,
  isMultiple,
  deletedItem,
  sourceId,
  ids
) {
  const Model = defineModel(model);

  if (!Model) {
    console.log("\nModel not found\n");
    return res.status(400).json({ error: "Modelo inválido" });
  }
  try {
    const itemsToDelete = isMultiple ? ids : [deletedItem];

    await Promise.all(
      itemsToDelete.map(async (id) => {
        await Model.findByIdAndDelete(id);
      })
    );

    // notify that sourceId made this
  } catch (err) {
    console.error("Erro na rotina de deleção", err);
  }
}

async function deleteRoutinesService(
  model,
  isMultiple,
  deletedItem,
  sourceId,
  ids
) {
  const Model = defineModel(model);

  if (!Model) {
    console.log("\nModel not found\n");
    return res.status(400).json({ error: "Modelo inválido" });
  }
  try {
    const itemsToDelete = isMultiple ? ids : [deletedItem];

    for (const id of itemsToDelete) {
      const deletedItem = await Model.findByIdAndDelete(id);

      if (deletedItem) {
        const { department } = deletedItem;

        if (department) {
          await defineModel("Department").findByIdAndUpdate(department, {
            $pull: { services: deletedItem._id.toString() },
          });
        }
      }
    }

    // notify that sourceId made this
  } catch (err) {
    console.error("Erro na rotina de deleção", err);
  }
}

async function deleteRoutinesServicePlan(
  model,
  isMultiple,
  deletedItem,
  sourceId,
  ids
) {
  const Model = defineModel(model);

  if (!Model) {
    console.log("\nModel not found\n");
    return res.status(400).json({ error: "Modelo inválido" });
  }
  try {
    const itemsToDelete = isMultiple ? ids : [deletedItem];

    await Promise.all(
      itemsToDelete.map(async (id) => {
        await Model.findByIdAndDelete(id);
      })
    );

    // notify that sourceId made this
  } catch (err) {
    console.error("Erro na rotina de deleção", err);
  }
}

async function deleteRoutinesStockEntry(
  model,
  isMultiple,
  deletedItem,
  sourceId,
  ids
) {
  const Model = defineModel(model);

  if (!Model) {
    console.log("\nModel not found\n");
    return res.status(400).json({ error: "Modelo inválido" });
  }
  try {
    const itemsToDelete = isMultiple ? ids : [deletedItem];

    await Promise.all(
      itemsToDelete.map(async (id) => {
        await Model.findByIdAndDelete(id);
      })
    );

    // notify that sourceId made this
  } catch (err) {
    console.error("Erro na rotina de deleção", err);
  }
}

async function deleteRoutinesUser(model, isMultiple, deletedItem, ids) {
  try {
    const Model = defineModel(model);

    if (!Model) {
      console.log("\nModel not found\n");
      return res.status(400).json({ error: "Modelo inválido" });
    }

    const itemsToDelete = isMultiple ? ids : [deletedItem];

    await Promise.all(
      itemsToDelete.map(async (id) => {
        const deletedUser = await Model.findByIdAndDelete(id);

        if (deletedUser) {
          const { department, position, role, groups } = deletedUser;

          // Atualizar departamento se existir
          if (department) {
            const updateField = deletedUser.isManager ? "manager" : "members";

            if (updateField === "manager") {
              await defineModel("Department").findByIdAndUpdate(department, {
                $set: { manager: "" },
              });
            } else {
              await defineModel("Department").findByIdAndUpdate(department, {
                $pull: { members: deletedUser._id.toString() },
              });
            }
          }

          if (position) {
            await defineModel("Position").findByIdAndUpdate(position, {
              $pull: { members: deletedUser._id.toString() },
            });
          }

          if (role) {
            await defineModel("Role").findByIdAndUpdate(role, {
              $pull: { members: deletedUser._id.toString() },
            });
          }

          if (groups && groups.length > 0) {
            await Promise.all(
              groups.map((groupId) =>
                defineModel("Group").findByIdAndUpdate(groupId, {
                  $pull: { members: deletedUser._id.toString() },
                })
              )
            );
          }

          const agenda = await Agenda.findOne({});
          if (agenda && Array.isArray(agenda.users)) {
            const indexToRemove = agenda.users.findIndex((userMap) =>
              userMap.has(deletedUser._id.toString())
            );
            if (indexToRemove !== -1) {
              agenda.users.splice(indexToRemove, 1);
              await agenda.save();
            }
          }

          await UserPreferences.deleteOne({
            userId: deletedUser._id.toString(),
          });
        }
      })
    );
  } catch (err) {
    console.error("Erro na rotina de deleção do usuário", err);
  }
}

async function removeFromAssigneeAgenda(
  scheduledTo,
  scheduleTime,
  assignee,
  jobId
) {
  try {
    const agenda = await Agenda.findOne();
    const [day, month, year] = scheduledTo ? scheduledTo.split("/") : "";
    const monthYearKey = `${month}-${year}`;

    // Encontra o índice do designado na lista de usuários
    const userIndex = agenda.users.findIndex((userMap) =>
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

    // Encontra o índice do evento a ser removido
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

    userAgenda[monthYearKey].splice(eventIndex, 1);

    await Agenda.findOneAndUpdate(
      {},
      { $set: { users: agenda.users } },
      { new: true }
    );

  } catch (err) {
    console.error("Erro ao remover evento da agenda do designado", err);
  }
}

module.exports = {
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
  removeFromAssigneeAgenda,
};
