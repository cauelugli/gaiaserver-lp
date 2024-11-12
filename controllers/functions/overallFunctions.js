export function calculatePriceDifferences(priceDifference, initialSum) {
  let sumOfAllIncreases = 0;
  let sumOfAllDiscounts = 0;

  Object.values(priceDifference).forEach((item) => {
    if (item.plusOrLess === "+") {
      if (item.type === "$") {
        sumOfAllIncreases += item.itemValue;
      } else if (item.type === "%") {
        sumOfAllIncreases += (initialSum * item.itemValue) / 100;
      }
    } else if (item.plusOrLess === "-") {
      if (item.type === "$") {
        sumOfAllDiscounts += item.itemValue;
      } else if (item.type === "%") {
        sumOfAllDiscounts += (initialSum * item.itemValue) / 100;
      }
    }
  });

  const finalSum = initialSum + sumOfAllIncreases - sumOfAllDiscounts;

  return {
    sumOfAllIncreases,
    sumOfAllDiscounts,
    finalSum,
  };
}

export function isButtonDisabled(
  modalOptions,
  okToDispatch,
  selectedServices,
  selectedProducts,
  priceDifference
) {
  if (okToDispatch) return false;
  else {
    switch (modalOptions.label) {
      case "Plano de Serviços":
        return (
          !okToDispatch ||
          selectedServices.length === 0 ||
          (Object.keys(priceDifference).length !== 0 && !okToDispatch)
        );

      case "Job":
        return false;
      case "Cliente Empresa":
        return false;
      case "Cliente Pessoa Física":
        return false;
      case "Operador":
        return false;
      case "Colaborador":
        return false;
      case "Gerente":
        return false;
      case "Cargo":
        return false;
      case "Departamento":
        return false;
      case "Grupo":
        return false;
      case "Perfil de Acesso":
        return false;

      case "Venda":
        return (
          !okToDispatch ||
          selectedProducts.length === 0 ||
          (Object.keys(priceDifference).length !== 0 && !okToDispatch)
        );

      default:
        return true;
    }
  }
}

export function checkAvailability(dynamicData, option) {
  switch (dynamicData) {
    case "members":
    case "managers":
      if (option.department && typeof option.department === "string") {
        return true;
      }
      break;

    case "resolvableRequest":
      if (
        option === "Aberto" ||
        option === "Aprovação Solicitada" ||
        option === "Resolvido"
      ) {
        return true;
      }
      break;

    case "approvableRequest":
      if (
        option === "Aprovado" ||
        option === "Aprovação Solicitada" ||
        option === "Resolvido"
      ) {
        return true;
      }
      break;

    case "manager":
      if (option.department && typeof option.department === "string") {
        return true;
      }
      break;

    case "creatableUsername":
      if (option) {
        return true;
      }
      break;

    case "removableUsername":
      if (!option) {
        return true;
      }
      break;

    default:
      return false;
  }
  return false;
}

export function isArray(data) {
  return Array.isArray(data) ? data : [];
}

export function getDataForPage(itemsResponse, page, model) {
  const filters = {
    products: (item) => item.name,
    stock: (item) => item.name,
  };

  const filterFunc = filters[page] || (() => true);

  let filteredItems = isArray(itemsResponse.data).filter(filterFunc);
  const baseItems = isArray(itemsResponse.data).filter((item) => !item.name);

  if (model === "Operator") {
    filteredItems = filteredItems.filter((user) => user.username);
  }

  return { filteredItems, baseItems };
}
