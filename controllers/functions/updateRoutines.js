const User = require("../../models/models/User");

const insertMembership = async (itemId, model, members) => {
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
};

const removeMembership = async (
  itemId,
  model,
  selectedMembers,
  previousMembers
) => {
  try {
    let removedMembers = [];
    let addedMembers = [];

    if (selectedMembers.length > 0) {
      removedMembers = previousMembers.filter(
        (memberId) => !selectedMembers.includes(memberId)
      );

      addedMembers = selectedMembers.filter(
        (memberId) => !previousMembers.includes(memberId)
      );
    }

    await Promise.all(
      removedMembers.map(async (memberId) => {
        try {
          const user = await User.findById(memberId);
          if (user) {
            user.groups = user.groups.filter(
              (groupId) => groupId.toString() !== itemId.toString()
            );
            await user.save();
          }
        } catch (error) {
          console.log(
            `Erro ao remover grupo para o usuário com ID ${memberId}:`,
            error
          );
        }
      })
    );

    await Promise.all(
      addedMembers.map(async (memberId) => {
        try {
          const user = await User.findById(memberId);
          if (user) {
            if (!user.groups.includes(itemId)) {
              user.groups.push(itemId);
              await user.save();
            }
          }
        } catch (error) {
          console.log(
            `Erro ao adicionar grupo para o usuário com ID ${memberId}:`,
            error
          );
        }
      })
    );

  } catch (error) {
    throw error;
  }
};

module.exports = { insertMembership, removeMembership };
