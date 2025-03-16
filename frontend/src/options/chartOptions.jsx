// chartOptions.jsx
// chartOptions.jsx
export const processData = (data, groupBy) => {
  const groupedData = {};

  data.forEach((item) => {
    const date = new Date(item.createdAt);
    let key;

    if (groupBy === "day") {
      // Formatar a data como YYYY-MM-DD
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(date.getDate()).padStart(2, "0")}`;
    } else if (groupBy === "week") {
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      key = `${weekStart.getFullYear()}-${String(
        weekStart.getMonth() + 1
      ).padStart(2, "0")}-${String(weekStart.getDate()).padStart(2, "0")}`;
    } else if (groupBy === "month") {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
    }

    if (!groupedData[key]) {
      groupedData[key] = [];
    }

    groupedData[key].push(item); // Alterado para adicionar o objeto completo
  });

  return groupedData;
};

export const getChartItems = (salesData, stockData, groupBy) => {
  const resolvedSales = salesData.data.filter(
    (item) => item.status === "Resolvido"
  );
  const allSales = salesData.data;

  const processedResolvedData = processData(resolvedSales, groupBy);
  const processedAllData = processData(allSales, groupBy);

  const labelsResolved = Object.keys(processedResolvedData).sort();
  const valuesResolved = labelsResolved.map(
    (date) => processedResolvedData[date]
  );

  const labelsAll = Object.keys(processedAllData).sort();
  const valuesAll = labelsAll.map((date) => processedAllData[date]);

  const resolvedStockEntries = stockData.data.filter(
    (item) => item.status === "Resolvido"
  );
  const allStockEntries = stockData.data;

  const processedResolvedStockData = processData(resolvedStockEntries, groupBy);
  const processedAllStockData = processData(allStockEntries, groupBy);

  const labelsResolvedStock = Object.keys(processedResolvedStockData).sort();
  const valuesResolvedStock = labelsResolvedStock.map(
    (date) => processedResolvedStockData[date]
  );

  const labelsAllStock = Object.keys(processedAllStockData).sort();
  const valuesAllStock = labelsAllStock.map(
    (date) => processedAllStockData[date]
  );

  return [
    {
      id: 0,
      title: "Vendas Criadas",
      labels: labelsAll,
      values: valuesAll,
      length: valuesAll.map((value) => value.length),
      color: "#1976d2",
    },
    {
      id: 1,
      title: "Vendas Resolvidas",
      labels: labelsResolved,
      values: valuesResolved,
      length: valuesResolved.map((value) => value.length),
      color: "#4caf50",
    },
    {
      id: 2,
      title: "Entradas de Estoque",
      labels: labelsAllStock,
      values: valuesAllStock,
      length: valuesAllStock.map((value) => value.length),
      color: "#ff9800",
    },
    {
      id: 3,
      title: "Entradas de Estoque Resolvidas",
      labels: labelsResolvedStock,
      values: valuesResolvedStock,
      length: valuesResolvedStock.map((value) => value.length),
      color: "#9c27b0",
    },
  ];
};
