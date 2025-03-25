const translatedLogTypes = [
  { key: "add", value: "Adição" },
  { key: "delete", value: "Deleção" },
  { key: "deleteMultiple", value: "Deleção Múltipla" },
  { key: "edit", value: "Edição" },
  { key: "archive", value: "Arquivamento" },
  { key: "unarchive", value: "Desarquivamento" },
  { key: "resolve", value: "Resolução" },
  { key: "requestBuy", value: "Resquisição de Compra" },
];

const translatedMethods = [
  { key: "add", value: "Adicionad" },
  { key: "delete", value: "Deletad" },
  { key: "edit", value: "Editad" },
];

const translatedModels = [
  { key: "Customer", value: "Cliente Empresa" },
  { key: "Client", value: "Cliente Pessoa Física" },
  { key: "Service", value: "Serviço" },
  { key: "ServicePlan", value: "Plano de Serviços" },
  { key: "Product", value: "Produto" },
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

const translateLogType = (logType) => {
  const translated = translatedLogTypes.find((item) => item.key === logType);
  return translated ? translated.value : logType;
};

module.exports = {
  translatedMethods,
  translateMethod,
  translatedModels,
  translateModel,
  translatedLogTypes,
  translateLogType,
};
