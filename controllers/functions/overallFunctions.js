
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

  console.log("initialSum on child", initialSum);
  console.log("sumOfAllIncreases on child", sumOfAllIncreases);
  console.log("sumOfAllDiscounts on child", sumOfAllDiscounts);

  const finalSum = initialSum + sumOfAllIncreases - sumOfAllDiscounts;

  return {
    sumOfAllIncreases,
    sumOfAllDiscounts,
    finalSum,
  };
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
