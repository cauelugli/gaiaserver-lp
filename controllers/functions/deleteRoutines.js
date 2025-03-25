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
            console.log("deletedItem had a problem");
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
        await Model.findByIdAndDelete(id);
      })
    );

    // notify that sourceId made this
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

async function deleteRoutinesProduct(
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

async function deleteRoutinesBaseProduct(id) {
  const Model = defineModel("Product");

  try {
    await Model.findByIdAndDelete(id);
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

module.exports = {
  deleteRoutinesClient,
  deleteRoutinesCustomer,
  deleteRoutinesDepartment,
  deleteRoutinesGroup,
  deleteRoutinesJob,
  deleteRoutinesOperator,
  deleteRoutinesPosition,
  deleteRoutinesProduct,
  deleteRoutinesBaseProduct,
  deleteRoutinesRole,
  deleteRoutinesSale,
  deleteRoutinesService,
  deleteRoutinesServicePlan,
  deleteRoutinesStockEntry,
  deleteRoutinesUser,
};
