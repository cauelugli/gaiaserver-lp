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
  // selectedProducts,
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
        return false;
      case "Entrada de Estoque":
        return false;
      default:
        return true;
    }
  }
}

export function checkAvailability(item, option, targetId) {
  switch (item) {
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
        if (option.department === targetId) {
          return false;
        } else {
          return true;
        }
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

export function isId(str) {
  return /^[a-f0-9]{24}$/i.test(str);
}

export function isDate(str) {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(str);
}

export function getDataForPage(itemsResponse, page, model) {
  const filters = {
    products: (item) => item.name,
    stock: (item) => (model === "Product" ? item.name : true),
  };

  const filterFunc = filters[page] || (() => true);

  let filteredItems = isArray(itemsResponse.data).filter(filterFunc);
  const baseItems = isArray(itemsResponse.data).filter((item) => !item.name);

  if (model === "Operator") {
    filteredItems = filteredItems.filter((user) => user.username);
  }

  return { filteredItems, baseItems };
}

export function createScheduleSlots(minTime, maxTime, serviceLengthLabel) {
  let serviceLength;
  switch (serviceLengthLabel) {
    case "30 min":
      serviceLength = 30;
      break;
    case "1h":
      serviceLength = 60;
      break;
    case "1:30h":
      serviceLength = 90;
      break;
    case "2h":
      serviceLength = 120;
      break;
    case "2:30h":
      serviceLength = 150;
      break;
    case "3h ou mais":
      serviceLength = 180;
      break;
    default:
      serviceLength = 60;
  }

  const slots = [];
  let currentTime = minTime * 60;

  while (currentTime + serviceLength <= maxTime * 60) {
    const startHour = Math.floor(currentTime / 60);
    const startMinute = currentTime % 60;

    const endHour = Math.floor((currentTime + serviceLength) / 60);
    const endMinute = (currentTime + serviceLength) % 60;

    const slot = `${String(startHour).padStart(2, "0")}:${String(
      startMinute
    ).padStart(2, "0")}h ~ ${String(endHour).padStart(2, "0")}:${String(
      endMinute
    ).padStart(2, "0")}h`;
    slots.push(slot);

    currentTime += serviceLength;
  }

  return slots;
}

export function loadPage() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 700);
  });
}
