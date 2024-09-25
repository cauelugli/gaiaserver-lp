const User = require("../../models/models/User");

const insertMembership = async (itemId, itemType, members) => {
  try {
    await Promise.all(
      members.map(async (memberId) => {
        try {
          const user = await User.findById(memberId);
          if (user) {
            switch (itemType) {
              case "Department":
                user.department = itemId;
                break;

              case "Group":
                if (!user.groups.includes(itemId)) {
                  user.groups.push(itemId);
                }
                break;

              default:
                console.log(`${itemType} desconhecido`);
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

module.exports = { insertMembership };
