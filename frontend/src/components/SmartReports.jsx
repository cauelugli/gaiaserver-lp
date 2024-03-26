/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";

import { Grid, Typography } from "@mui/material";

import {
  Bar,
  //   Line,
  //   Pie,
  //   Doughnut,
  //   Radar,
  //   PolarArea,
  //   Bubble,
  //   Scatter,
} from "react-chartjs-2";

import Chart from "chart.js/auto";

const SmartReports = ({ requests }) => {
  const totalRequests = requests.length;
  const activeRequests = requests.filter(
    (request) => request.isActive && request.status !== "Concluido"
  ).length;
  const resolvedRequests = requests.filter(
    (request) => request.status === "Concluido"
  ).length;
  const archivedRequests = requests.filter(
    (request) => request.status === "Arquivado"
  ).length;

  const colors = {
    blue: "rgba(54, 162, 235, 0.5)",
    blueBorder: "rgba(54, 162, 235, 1)",
    lightgreen: "rgba(54, 226, 235, 0.5)",
    lightgreenBorder: "rgba(54, 226, 235, 1)",
    lightpink: "rgba(255, 99, 132, 0.5)",
    lightpinkBorder: "rgba(255, 99, 132, 1)",
    grey: "rgba(133, 133, 133, 0.5)",
    greyBorder: "rgba(133, 133, 133, 1)",
  };

  //FIRST CHART
  const requestsData = {
    labels: [""],
    datasets: [
      {
        label: "Ativos",
        data: [activeRequests],
        backgroundColor: colors.blue,
        borderColor: colors.blueBorder,
        borderWidth: 1,
      },
      {
        label: "Concluidos",
        data: [resolvedRequests],
        backgroundColor: colors.lightgreen,
        borderColor: colors.lightgreenBorder,
        borderWidth: 1,
      },
      {
        label: "Total",
        data: [totalRequests],
        backgroundColor: colors.lightpink,
        borderColor: colors.lightpinkBorder,
        borderWidth: 1,
      },
      {
        label: "Arquivados",
        data: [archivedRequests],
        backgroundColor: colors.grey,
        borderColor: colors.greyBorder,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    // indexAxis: "y", gráfico na horizontal
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 10,
        },
      },
    },
  };

  //FIRST CHART END

  //SECOND CHART
  const getStartAndEndOfWeek = (date) => {
    const now = date ? new Date(date) : new Date();
    const dayOfWeek = now.getDay();
    const start = new Date(now);
    start.setDate(now.getDate() - dayOfWeek);
    const end = new Date(now);
    end.setDate(now.getDate() + (6 - dayOfWeek));

    return { start, end };
  };

  const { start, end } = getStartAndEndOfWeek(new Date());

  const weekRequests = requests.filter((request) => {
    const createdAt = new Date(request.createdAt);
    return createdAt >= start && createdAt <= end;
  });

  const countsByDay = Array(7).fill(0);
  weekRequests.forEach((request) => {
    const day = new Date(request.createdAt).getDay();
    countsByDay[day]++;
  });

  const labels = Array(7)
    .fill(null)
    .map((_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return `${
        ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"][index]
      } ${date.getDate()}/${date.getMonth() + 1}`;
    });

  const weekRequestsData = {
    labels,
    datasets: [
      {
        data: countsByDay,
        backgroundColor: Object.values(colors).slice(0, 7),
        borderColor: Object.values(colors).map((color) =>
          color.replace(/0\.5/, "1")
        ),
        borderWidth: 1,
      },
    ],
  };

  const weeklyOptions = {
    // indexAxis: "y", gráfico na horizontal
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  //SECOND CHART END
  //THIRD CHART

  const getStartOfLastThreeMonths = () => {
    const now = new Date();
    now.setDate(1);
    now.setMonth(now.getMonth() - 2);
    return now;
  };

  const startOfLastThreeMonths = getStartOfLastThreeMonths();

  const countsByMonth = Array(3).fill(0);
  requests.forEach((request) => {
    const createdAt = new Date(request.createdAt);
    if (createdAt >= startOfLastThreeMonths) {
      const monthDiff =
        createdAt.getMonth() - startOfLastThreeMonths.getMonth();
      const yearDiff =
        createdAt.getFullYear() - startOfLastThreeMonths.getFullYear();
      const index = monthDiff + yearDiff * 12;
      if (index >= 0 && index < 3) {
        countsByMonth[index]++;
      }
    }
  });

  const trimesterLabels = Array(3)
    .fill(null)
    .map((_, index) => {
      const date = new Date(startOfLastThreeMonths);
      date.setMonth(startOfLastThreeMonths.getMonth() + index);
      return date.toLocaleDateString("pt-BR", {
        month: "short",
      });
    });

  const lastThreeMonthsRequestsData = {
    labels: trimesterLabels,
    datasets: [
      {
        label: "Solicitações por mês",
        data: countsByMonth,
        backgroundColor: [colors.blue, colors.lightgreen, colors.lightpink],
        borderColor: [
          colors.blueBorder,
          colors.lightgreenBorder,
          colors.lightpinkBorder,
        ],
        borderWidth: 1,
      },
    ],
  };

  const trimesterOptions = {
    // indexAxis: "y", gráfico na horizontal
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  //THIRD CHART END

  const chartWidth = 400;
  const chartHeight = 350;

  return (
    <Grid container direction="row" spacing={2}>
      <Grid item>
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Typography sx={{ fontSize: 12 }}>
            Solicitações (Jobs e Vendas)
          </Typography>
          <div style={{ width: chartWidth, height: chartHeight }}>
            <Bar data={requestsData} options={options} />
          </div>
        </Grid>
      </Grid>
      <Grid item>
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Typography sx={{ fontSize: 12 }}>Semanal</Typography>
          <div style={{ width: chartWidth, height: chartHeight }}>
            <Bar data={weekRequestsData} options={weeklyOptions} />
          </div>
        </Grid>
      </Grid>
      <Grid item>
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Typography sx={{ fontSize: 12 }}>Últimos 3 Meses</Typography>
          <div style={{ width: chartWidth, height: chartHeight }}>
            <Bar
              data={lastThreeMonthsRequestsData}
              options={trimesterOptions}
            />
          </div>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SmartReports;
