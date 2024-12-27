const { defineModel } = require("./routeFunctions");
const User = require("../../models/models/User");

const insertMembership = async (userId, model, modelId) => {
  const Model = defineModel(model);
  try {
    const item = await Model.findById(modelId);
    if (!item.members.includes(userId)) {
      item.members.push(userId);
    }
    await item.save();
  } catch (error) {
    console.error(`Erro ao inserir o userId no modelo ${model}:`);
    throw error;
  }
};

const removeMembership = async (userId, model, modelId) => {
  const Model = defineModel(model);
  try {
    const item = await Model.findById(modelId);
    if (item.members.includes(userId)) {
      item.members.pull(userId);
    } else {
      console.log("num tem no item naum", item);
    }
    await item.save();
  } catch (error) {
    console.error(`Erro ao remover o userId no modelo ${model}:`);
    throw error;
  }
};

const insertMembersToGroup = async (itemId, model, members) => {
  if (members[0] !== 0) {
    try {
      await Promise.all(
        members.map(async (memberId) => {
          try {
            const user = await User.findById(memberId);
            if (user) {
              switch (model) {
                case "Department":
                  user.department = itemId;
                  break;

                case "Group":
                  if (!user.groups.includes(itemId)) {
                    user.groups.push(itemId);
                  }
                  break;

                default:
                  console.log(`${model} desconhecido`);
              }

              await user.save();
            }
          } catch (error) {
            console.log(`Erro ao executar rotina de update`, error);
          }
        })
      );
    } catch (error) {
      throw error;
    }
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

module.exports = {
  insertMembership,
  removeMembership,
  insertMembersToGroup,
  removeMembersFromGroup,
};
