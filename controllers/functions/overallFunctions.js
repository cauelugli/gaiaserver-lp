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

export function isArray(data) {
  return Array.isArray(data) ? data : [];
}

export function isId(str) {
  return /^[a-f0-9]{24}$/i.test(str);
}

export function isDate(str) {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(str);
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
