// chartOptions.jsx
export const processData = (data, groupBy) => {
  const counts = {};

  data.forEach((item) => {
    const date = new Date(item.createdAt);
    let key;

    if (groupBy === "day") {
      key = date.toISOString().split("T")[0];
    } else if (groupBy === "week") {
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      key = weekStart.toISOString().split("T")[0];
    } else if (groupBy === "month") {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
    }

    counts[key] = (counts[key] || 0) + 1;
  });

  return counts;
};

export const getChartItems = (salesData, stockData, groupBy) => {
  const resolvedSales = salesData.data.filter(
    (item) => item.status === "Resolvido"
  );
  const allSales = salesData.data;
  const totalPriceAllSales = allSales.reduce(
    (total, item) => total + item.price,
    0
  );
  const totalPriceResolvedSales = resolvedSales.reduce(
    (total, item) => total + item.price,
    0
  );

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
  const totalResolvedStockEntries = resolvedStockEntries.reduce(
    (total, item) => total + item.price,
    0
  );
  const totalAllStockEntries = allStockEntries.reduce(
    (total, item) => total + item.price,
    0
  );

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
      total: totalPriceAllSales,
      color: "#1976d2",
    },
    {
      id: 1,
      title: "Vendas Resolvidas",
      labels: labelsResolved,
      values: valuesResolved,
      total: totalPriceResolvedSales,
      color: "#4caf50",
    },
    {
      id: 2,
      title: "Entradas de Estoque",
      labels: labelsAllStock,
      values: valuesAllStock,
      total: totalAllStockEntries,
      color: "#ff9800",
    },
    {
      id: 3,
      title: "Entradas de Estoque Resolvidas",
      labels: labelsResolvedStock,
      values: valuesResolvedStock,
      total: totalResolvedStockEntries,
      color: "#9c27b0",
    },
  ];
};
