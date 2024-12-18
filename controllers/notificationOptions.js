const translatedMethods = [
  { key: "add", value: "Adicionad" },
  { key: "delete", value: "Deletad" },
  { key: "edit", value: "Editad" },
];

const translatedModels = [
  { key: "User", value: "Colaborador" },
  { key: "Customer", value: "Cliente Empresa" },
  { key: "Client", value: "Cliente Pessoa Física" },
  { key: "Service", value: "Serviço" },
  { key: "Departamento", value: "Departamento" },
  { key: "Group", value: "Grupo" },
  { key: "ServicePlan", value: "Plano de Serviços" },
  { key: "Product", value: "Produto" },
  { key: "Operator", value: "Operador" },
  { key: "Role", value: "Perfil de Acesso" },
  { key: "Position", value: "Posição" },
  { key: "Sale", value: "Venda" },
];

const translateMethod = (method) => {
  const translated = translatedMethods.find((item) => item.key === method);
  return translated ? translated.value : method;
};

const translateModel = (model) => {
  const translated = translatedModels.find((item) => item.key === model);
  return translated ? translated.value : model;
};

module.exports = {
  translatedMethods,
  translateMethod,
  translatedModels,
  translateModel,
};
