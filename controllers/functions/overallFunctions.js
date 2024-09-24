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
  if (dynamicData === "members" || dynamicData === "managers") {
    if (option.department && typeof option.department === "string") {
      return true;
    }
  }
  return false;
}

export function isArray(data) {
  return Array.isArray(data) ? data : [];
}

export function getDataForPage(itemsResponse, page) {
  const filters = {
    products: (item) => item.name,
    stock: (item) => item.name,
  };

  const filterFunc = filters[page] || (() => true);

  const filteredItems = isArray(itemsResponse.data).filter(filterFunc);
  const baseItems = isArray(itemsResponse.data).filter((item) => !item.name);

  return { filteredItems, baseItems };
}

// export function darkenColor(hex, factor) {
//   hex = hex.replace(/^#/, "");
//   const bigint = parseInt(hex, 16);
//   const r = (bigint >> 16) & 255;
//   const g = (bigint >> 8) & 255;
//   const b = bigint & 255;

//   const newR = Math.max(0, Math.round(r - factor));
//   const newG = Math.max(0, Math.round(g - factor));
//   const newB = Math.max(0, Math.round(b - factor));

//   const darkenedHex = `#${((newR << 16) | (newG << 8) | newB)
//     .toString(16)
//     .padStart(6, "0")}`;

//   return darkenedHex;
// }
