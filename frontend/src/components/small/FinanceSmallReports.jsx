/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import {
  CircularProgress,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid2,
  Box,
  Button,
} from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";

const FinanceSmallReports = ({ api, mainColor }) => {
  const [salesData, setSalesData] = useState(null);
  const [stockData, setStockData] = useState(null);
  const [groupBy, setGroupBy] = useState("week");
  const [selectedChart, setSelectedChart] = useState(0);
  const [isChartFocused, setIsChartFocused] = useState(false);

  const handleHighlightItem = (item) => {
    setSelectedChart(item);
    setIsChartFocused(true);
  };

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await api.get("/get/dashboard");
        const sales = response.data.find((item) => item.model === "Sale");
        const stock = response.data.find((item) => item.model === "StockEntry");
        setSalesData(sales);
        setStockData(stock);
      } catch (err) {
        console.error("Erro ao buscar dados de vendas:", err);
      }
    };

    fetchSalesData();
  }, [api]);

  const processData = (data, groupBy) => {
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

  if (!salesData || !salesData.data || !stockData || !stockData.data) {
    return <CircularProgress />;
  }

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

  const chartItems = [
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

  return (
    <Grid2 sx={{ width: "98%" }}>
      <Grid2 sx={{ m: 2 }} container direction="row">
        <Typography id="title" sx={{ fontSize: "2vw", mr: "1vw", ml: -1 }}>
          Relatórios
        </Typography>
        <FormControl>
          <InputLabel>Período</InputLabel>
          <Select
            value={groupBy}
            label="Período"
            onChange={(e) => setGroupBy(e.target.value)}
          >
            <MenuItem value="day">Por Dia</MenuItem>
            <MenuItem value="week">Por Semana</MenuItem>
            <MenuItem value="month">Por Mês</MenuItem>
          </Select>
        </FormControl>
        {isChartFocused && (
          <Button
            sx={{ ml: "auto", height: "auto" }}
            variant="contained"
            color="error"
            onClick={() => setIsChartFocused(false)}
          >
            X
          </Button>
        )}
      </Grid2>
      <Grid2
        container
        direction="row"
        justifyContent="center"
        spacing={4}
        sx={{ pb: 2 }}
      >
        {isChartFocused ? (
          <Grid2 container direction="column">
            <Typography
              id="title"
              align="center"
              sx={{
                fontWeight: "bold",
                fontSize: "1.25vw",
              }}
            >
              {chartItems[selectedChart].title}
            </Typography>
            <Grid2 sx={{ my: -5 }}>
              <LineChart
                xAxis={[
                  {
                    data: chartItems[selectedChart].labels,
                    scaleType: "point",
                  },
                ]}
                series={[
                  {
                    data: chartItems[selectedChart].values,
                    color: chartItems[selectedChart].color,
                  },
                ]}
                width={1350}
                height={300}
              />
              <Typography
                sx={{ fontWeight: "bold", fontSize: "1.25vw" }}
                align="center"
              >
                Total: R$ {chartItems[selectedChart].total.toFixed(2)}
              </Typography>
            </Grid2>
          </Grid2>
        ) : (
          chartItems.map((item, index) => (
            <Grid2 container direction="column" key={index}>
              <Box
                sx={{
                  position: "relative",
                  display: "inline-block",
                }}
              >
                <Typography
                  onClick={() => handleHighlightItem(index)}
                  id="title"
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    borderRadius: "4px",
                    transition: "background-color 0.3s ease",
                    ":hover": {
                      backgroundColor: `${mainColor}`,
                      color: "white !important",
                      cursor: "pointer",
                    },
                    ":hover::after": {
                      content: "'🔍'", // don't remove the '' !!!
                      position: "absolute",
                      ml: index === 3 ? 1 : 2,
                      top: "50%",
                      transform: "translateY(-50%)",
                    },
                  }}
                >
                  {item.title}
                </Typography>
              </Box>
              <Grid2 sx={{ my: -5 }}>
                <LineChart
                  xAxis={[
                    {
                      data: item.labels,
                      scaleType: "point",
                    },
                  ]}
                  series={[
                    {
                      data: item.values,
                      color: item.color,
                    },
                  ]}
                  width={350}
                  height={200}
                />
                <Typography sx={{ fontWeight: "bold" }} align="center">
                  Total: R$ {item.total.toFixed(2)}
                </Typography>
              </Grid2>
            </Grid2>
          ))
        )}
      </Grid2>
    </Grid2>
  );
};

export default FinanceSmallReports;
