const User = require("../../models/models/User");

const insertMembership = async (itemId, model, members) => {
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

const removeMembership = async (
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

module.exports = { insertMembership, removeMembership };
