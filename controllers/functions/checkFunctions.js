const { defineModel } = require("./routeFunctions");

async function checkSameName(data) {
  try {
    const Model = defineModel(data.model);

    if (!Model) {
      console.log("\nModel not found\n");
      throw new Error("Modelo Inválido");
    }

    const existingName = await Model.findOne({ name: data.name });
    if (existingName) {
      throw new Error("Nome já cadastrado");
    }
  } catch (err) {
    //Nome já cadastrado
    throw err;
  }
}

module.exports = { checkSameName };
