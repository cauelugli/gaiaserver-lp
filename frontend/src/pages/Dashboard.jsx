/* eslint-disable react/prop-types */
import * as React from "react";
import { Box, CircularProgress, Grid2, Typography } from "@mui/material";
import BarChart from "../components/charts/BarChart";

const Dashboard = (props) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [fullData, setFullData] = React.useState({
    User: [],
    Job: [],
    Sale: [],
  });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const resData = await props.api.get("/get/dashboard");
        const processedData = {
          User: resData.data.find((item) => item.model === "User"),
          Job: resData.data.find((item) => item.model === "Job"),
          Sale: resData.data.find((item) => item.model === "Sale"),
        };
        setFullData(processedData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [props.api]);

  const countByDate = (data) => {
    const counts = {};
    data?.data?.forEach((item) => {
      // eslint-disable-next-line no-unused-vars
      const [year, month, day] = item.createdAt.split("T")[0].split("-");
      const formattedDate = `${day}/${month}`;
      counts[formattedDate] = (counts[formattedDate] || 0) + 1;
    });
    return counts;
  };

  const userCounts = countByDate(fullData.User);
  const jobCounts = countByDate(fullData.Job);
  const saleCounts = countByDate(fullData.Sale);

  const sortLabels = (labels) => {
    return labels.sort((a, b) => {
      const [dayA, monthA] = a.split("/");
      const [dayB, monthB] = b.split("/");

      // Criar objetos Date para comparar as datas
      const dateA = new Date(`2023-${monthA}-${dayA}`); // Usamos um ano fixo (2023) apenas para comparação
      const dateB = new Date(`2023-${monthB}-${dayB}`);

      return dateA - dateB; // Ordena do mais antigo para o mais novo
    });
  };

  const labels = sortLabels(
    Object.keys({
      ...userCounts,
      ...jobCounts,
      ...saleCounts,
    })
  );

  const generalChartData = {
    labels,
    datasets: [
      {
        label: "Colaboradores",
        data: labels.map((date) => userCounts[date] || 0),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Jobs",
        data: labels.map((date) => jobCounts[date] || 0),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
      {
        label: "Vendas",
        data: labels.map((date) => saleCounts[date] || 0),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  const jobsChartData = {
    labels,
    datasets: [
      {
        label: "Jobs",
        data: labels.map((date) => jobCounts[date] || 0),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  const salesChartData = {
    labels,
    datasets: [
      {
        label: "Vendas",
        data: labels.map((date) => saleCounts[date] || 0),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  const usersChartData = {
    labels,
    datasets: [
      {
        label: "Colaboradores",
        data: labels.map((date) => userCounts[date] || 0),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const getChartOptions = (showLegend) => ({
    responsive: true,
    plugins: {
      legend: {
        display: showLegend,
        position: "top",
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || "";
            const value = context.raw || 0;
            return `${label}: ${value}`;
          },
        },
      },
    },
  });

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: props.topBar ? "105%" : "100%", minHeight: "50vw" }}>
      <Typography sx={{ fontSize: "1.5vw", m: 2, fontWeight: "bold" }} id="title">
        Dashboard
      </Typography>
      <Box sx={{ width: "40%", mx: "auto" }}>
        <Typography variant="h6" align="center" gutterBottom>
          Geral
        </Typography>
        <BarChart
          data={generalChartData}
          options={getChartOptions(true)}
          width="100%"
          height="300"
        />
      </Box>
      <Grid2
        container
        direction="row"
        justifyContent="space-around"
        sx={{ mt: 1 }}
      >
        <Box sx={{ width: "22%" }}>
          <Typography variant="h6" align="center" gutterBottom>
            Jobs
          </Typography>
          <BarChart
            data={jobsChartData}
            options={getChartOptions(false)}
            width="100%"
            height="300"
          />
        </Box>

        <Box sx={{ width: "22%" }}>
          <Typography variant="h6" align="center" gutterBottom>
            Vendas
          </Typography>
          <BarChart
            data={salesChartData}
            options={getChartOptions(false)}
            width="100%"
            height="300"
          />
        </Box>

        <Box sx={{ width: "22%" }}>
          <Typography variant="h6" align="center" gutterBottom>
            Colaboradores
          </Typography>
          <BarChart
            data={usersChartData}
            options={getChartOptions(false)}
            width="100%"
            height="300"
          />
        </Box>
      </Grid2>
    </Box>
  );
};

export default Dashboard;
