/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import {
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid2,
} from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart"; // Importe o LineChart

const FinanceSmallReports = ({ api }) => {
  const [salesData, setSalesData] = useState(null);
  const [groupBy, setGroupBy] = useState("week");

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await api.get("/get/dashboard");
        const sales = response.data.find((item) => item.model === "Sale");
        const resolvedSales = sales
          ? sales.data.filter((item) => item.status === "Resolvido")
          : [];
        setSalesData({ ...sales, data: resolvedSales });
      } catch (err) {
        console.error("Erro ao buscar dados de vendas:", err);
      }
    };

    fetchSalesData();
  }, [api]);

  // Função para processar os dados conforme a opção selecionada
  const processData = (data, groupBy) => {
    const counts = {};

    data.forEach((item) => {
      const date = new Date(item.createdAt);
      let key;

      if (groupBy === "day") {
        key = date.toISOString().split("T")[0]; // Formato: YYYY-MM-DD
      } else if (groupBy === "week") {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay()); // Início da semana (domingo)
        key = weekStart.toISOString().split("T")[0]; // Formato: YYYY-MM-DD
      } else if (groupBy === "month") {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}`; // Formato: YYYY-MM
      }

      counts[key] = (counts[key] || 0) + 1;
    });

    return counts;
  };

  // Se não houver dados de vendas, exibe uma mensagem
  if (!salesData || !salesData.data) {
    return <div>Nenhum dado de vendas disponível.</div>;
  }

  // Processa os dados conforme a opção selecionada
  const processedData = processData(salesData.data, groupBy);

  // Prepara os dados para o gráfico
  const labels = Object.keys(processedData).sort();
  const values = labels.map((date) => processedData[date]);

  return (
    <Grid2 container direction="column" spacing={2}>
      <Grid2 item>
        <FormControl sx={{ mt: 1 }}>
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
      <Grid2 item>
        <Typography variant="h6" align="center" gutterBottom>
          Vendas Resolvidas{" "}
          {groupBy === "day"
            ? "por Dia"
            : groupBy === "week"
            ? "por Semana"
            : "por Mês"}
        </Typography>
      </Grid2>
      <Grid2 item>
        {/* Gráfico de linhas */}
        <LineChart
          xAxis={[
            {
              data: labels,
              scaleType: "point", // Exibe os rótulos como pontos no eixo X
            },
          ]}
          series={[
            {
              data: values,
              label: "Vendas Resolvidas",
              color: "#1976d2", // Cor da linha
            },
          ]}
          width={800}
          height={400}
        />
      </Grid2>
    </Grid2>
  );
};

export default FinanceSmallReports;
