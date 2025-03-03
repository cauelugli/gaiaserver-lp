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
} from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";

const FinanceSmallReports = ({ api, mainColor }) => {
  const [salesData, setSalesData] = useState(null);
  const [stockData, setStockData] = useState(null);
  const [groupBy, setGroupBy] = useState("week");

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

  return (
    <Grid2
      sx={{
        ml: 2,
        border: `1px solid ${mainColor}`,
        borderRadius: 2,
        width: "98%",
      }}
    >
      <Grid2 sx={{ m: 2 }} container direction="row">
        <Typography id="title" sx={{ fontSize: "2vw", mr: "1vw" }}>
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
      </Grid2>
      <Grid2 container direction="row" spacing={3} sx={{ pb: 2 }}>
        <Grid2 item>
          <LineChart
            xAxis={[
              {
                data: labelsAll,
                scaleType: "point",
              },
            ]}
            series={[
              {
                data: valuesAll,
                label: "Vendas Criadas",
                color: "#1976d2",
              },
            ]}
            width={350}
            height={200}
          />
          <Typography sx={{ fontWeight: "bold" }} align="center">
            Total: R$ {totalPriceAllSales.toFixed(2)}
          </Typography>
        </Grid2>

        <Grid2 item>
          <LineChart
            xAxis={[
              {
                data: labelsResolved,
                scaleType: "point",
              },
            ]}
            series={[
              {
                data: valuesResolved,
                label: "Vendas Resolvidas",
                color: "#4caf50",
              },
            ]}
            width={350}
            height={200}
          />
          <Typography sx={{ fontWeight: "bold" }} align="center">
            Total: R$ {totalPriceResolvedSales.toFixed(2)}
          </Typography>
        </Grid2>

        <Grid2 item>
          <LineChart
            xAxis={[
              {
                data: labelsAllStock,
                scaleType: "point",
              },
            ]}
            series={[
              {
                data: valuesAllStock,
                label: "Entradas de Estoque",
                color: "#ff9800",
              },
            ]}
            width={350}
            height={200}
          />
          <Typography sx={{ fontWeight: "bold" }} align="center">
            Total: R$ {totalAllStockEntries.toFixed(2)}
          </Typography>
        </Grid2>

        <Grid2 item>
          <LineChart
            xAxis={[
              {
                data: labelsResolvedStock,
                scaleType: "point",
              },
            ]}
            series={[
              {
                data: valuesResolvedStock,
                label: "Entradas de Estoque Resolvidas",
                color: "#9c27b0",
              },
            ]}
            width={350}
            height={200}
          />
          <Typography sx={{ fontWeight: "bold" }} align="center">
            Total: R$ {totalResolvedStockEntries.toFixed(2)}
          </Typography>
        </Grid2>
        <Grid2 item>
          <LineChart
            xAxis={[
              {
                data: labelsResolvedStock,
                scaleType: "point",
              },
            ]}
            series={[
              {
                data: valuesResolvedStock,
                label: "Entradas de Estoque Resolvidas",
                color: "#9c27b0",
              },
            ]}
            width={350}
            height={200}
          />
          <Typography sx={{ fontWeight: "bold" }} align="center">
            Total: R$ {totalResolvedStockEntries.toFixed(2)}
          </Typography>
        </Grid2>
      </Grid2>
    </Grid2>
  );
};

export default FinanceSmallReports;
