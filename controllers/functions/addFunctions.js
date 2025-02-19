const Counters = require("../../models/models/Counters");
const Department = require("../../models/models/Department");
const FinanceIncome = require("../../models/models/FinanceIncome");
const FinanceOutcome = require("../../models/models/FinanceOutcome");
const Job = require("../../models/models/Job");
const Position = require("../../models/models/Position");
const Product = require("../../models/models/Product");
const Role = require("../../models/models/Role");
const Sale = require("../../models/models/Sale");
const StockEntry = require("../../models/models/StockEntry");
const User = require("../../models/models/User");
const UserPreferences = require("../../models/models/UserPreferences");
const { defineModel } = require("./routeFunctions");

async function addUserRoutines(model, source) {
  try {
    const { department, position, role } = source;
    switch (model) {
      case "User":
        if (department) {
          const updateField = source.isManager ? "manager" : "members";

          if (source.isManager) {
            await Department.findByIdAndUpdate(department, {
              $set: { [updateField]: source._id.toString() },
            });
          } else {
            await Department.findByIdAndUpdate(department, {
              $push: { [updateField]: source._id.toString() },
            });
          }
        }

        if (position) {
          await Position.findByIdAndUpdate(position, {
            $push: { members: source._id.toString() },
          });
        }

        if (role) {
          await Role.findByIdAndUpdate(role, {
            $push: { members: source._id.toString() },
          });
        }

        const maxYears = 6;

        function generateMonths() {
          const months = [];
          const currentDate = new Date();
          const endDate = new Date(currentDate);
          endDate.setFullYear(currentDate.getFullYear() + maxYears);

          let currentMonth = currentDate.getMonth();
          let currentYear = currentDate.getFullYear();

          while (
            currentYear < endDate.getFullYear() ||
            (currentYear === endDate.getFullYear() &&
              currentMonth <= endDate.getMonth())
          ) {
            const monthString = `${String(currentMonth + 1).padStart(
              2,
              "0"
            )}-${currentYear}`;
            months.push(monthString);
            currentMonth++;

            if (currentMonth === 12) {
              currentMonth = 0;
              currentYear++;
            }
          }

          return months;
        }

        const newUserPreferences = new UserPreferences({ userId: source._id });
        await newUserPreferences.save();

        break;

      default:
        break;
    }
  } catch (err) {
    console.error(`Erro na rotina de adição em ${model}`, err);
  }
}

async function addCounter(sourceId, model) {
  try {
    let counter = await Counters.findOne();
    if (!counter) {
      counter = new Counters({
        job: model === "Job" ? 1 : 0,
        sale: model === "Sale" ? 1 : 0,
        stockEntry: model === "StockEntry" ? 1 : 0,
        financeIncome: model === "FinanceIncome" ? 1 : 0,
        financeOutcome: model === "FinanceOutcome" ? 1 : 0,
      });
    }
    let newNumber;

    switch (model) {
      case "Job":
        newNumber = counter.job + 1;
        counter.job = newNumber;
        await Job.findByIdAndUpdate(sourceId, { $set: { number: newNumber } });
        break;
      case "Sale":
        newNumber = counter.sale + 1;
        counter.sale = newNumber;
        await Sale.findByIdAndUpdate(sourceId, { $set: { number: newNumber } });
        break;
      case "FinanceIncome":
        newNumber = counter.financeIncome + 1;
        counter.financeIncome = newNumber;
        await FinanceIncome.findByIdAndUpdate(sourceId, {
          $set: { number: newNumber },
        });
        break;
      case "FinanceOutcome":
        newNumber = counter.financeOutcome + 1;
        counter.financeOutcome = newNumber;
        await FinanceOutcome.findByIdAndUpdate(sourceId, {
          $set: { number: newNumber },
        });
        break;
      case "StockEntry":
        newNumber = counter.stockEntry + 1;
        counter.stockEntry = newNumber;
        await StockEntry.findByIdAndUpdate(sourceId, {
          $set: { number: newNumber },
        });
        break;
      default:
        throw new Error(`Modelo não suportado: ${model}`);
    }

    await counter.save();
  } catch (err) {
    console.error(`Erro na rotina de adição em ${model}:`, err);
  }
}

async function addFinanceIncome(data) {
  try {
    const newFinanceIncome = new FinanceIncome({
      itemId: data.resolvedItem._id.toString(),
      itemNumber: data.resolvedItem.number,
      customer: data.resolvedItem.customer,
      user: data.resolvedItem.worker || data.resolvedItem.seller,
      service: data.resolvedItem.service,
      price: data.resolvedItem.price,
      items: data.resolvedItem.items || data.resolvedItem.products,
      typeIncome: data.type,
      createdBy: data.createdBy,
    });
    const savedFinanceIncome = await newFinanceIncome.save();
    await addCounter(savedFinanceIncome._id, "FinanceIncome");
  } catch (err) {
    console.error(`Erro ao criar finance income:`, err);
  }
}

async function addFinanceOutcome(data) {
  try {
    const newFinanceOutcome = new FinanceOutcome({
      itemId: data.resolvedItem._id.toString(),
      itemNumber: data.resolvedItem.number,
      price: data.resolvedItem.price,
      items: data.resolvedItem.items,
      typeOutcome: data.type,
      createdBy: data.createdBy,
    });
    const savedFinanceOutcome = await newFinanceOutcome.save();
    await addCounter(savedFinanceOutcome._id, "FinanceOutcome");
  } catch (err) {
    console.error(`Erro ao criar finance outcome:`, err);
  }
}

async function addManagerToDepartment(managerId, departmentId) {
  await Department.findByIdAndUpdate(departmentId, {
    $set: { manager: managerId.toString() },
  });
}

async function addOperator(data) {
  const user = await User.findById(data.id);

  if (!user) {
    throw new Error("User not found");
  }

  const updatedFields = {
    username: data.username,
    password: data.password,
    role: data.role,
  };

  return await User.findByIdAndUpdate(data.id, { $set: updatedFields });
}

async function addServiceToDepartment(serviceId, departmentId) {
  await Department.findByIdAndUpdate(departmentId, {
    $push: { services: serviceId.toString() },
  });
}

const insertMembership = async (userId, modelId) => {
  const Model = defineModel("Role");
  try {
    const item = await Model.findById(modelId);
    if (!item.members.includes(userId)) {
      item.members.push(userId);
    }
    await item.save();
  } catch (error) {
    console.error(`Erro ao inserir o userId no modelo Role`);
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

module.exports = {
  addCounter,
  addFinanceOutcome,
  addFinanceIncome,
  addManagerToDepartment,
  addOperator,
  addServiceToDepartment,
  addUserRoutines,
  insertMembership,
  insertMembersToGroup,
};
