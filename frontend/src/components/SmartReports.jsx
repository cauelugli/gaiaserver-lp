/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Typography,
} from "@mui/material";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

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

const SmartReports = ({ requests, customers, users, fromPage }) => {
  //USERS
  const totalAllUsers = users.length - 1;
  const totalManagers = users.filter((user) => user.isManager).length;
  const totalUsers = totalAllUsers - totalManagers;

  const allActiveUsers = users.filter((user) => user.isActive).length - 1;
  const activeManagers = users.filter(
    (user) => user.isManager && user.isActive
  ).length;
  const activeUsers =
    users.filter((user) => !user.isManager && user.isActive).length - 1;

  const allArchivedUsers = users.filter((user) => !user.isActive).length;
  const archivedUsers = users.filter(
    (user) => !user.isActive && !user.isManager
  ).length;
  const archivedManagers = users.filter(
    (user) => !user.isActive && user.isManager
  ).length;

  //USERS END
  //CUSTOMERS
  const totalAllCustomers = customers.length;
  const totalCustomers = customers.filter((customer) => customer.cnpj).length;
  const totalClients = customers.filter((customer) => customer.cpf).length;

  const allActiveCustomers = customers.filter(
    (customer) => customer.isActive
  ).length;
  const activeCustomers = customers.filter(
    (customer) => customer.isActive && customer.cnpj
  ).length;
  const activeClients = customers.filter(
    (customer) => customer.isActive && customer.cpf
  ).length;

  const companyCustomers = customers.filter((customer) => customer.cnpj).length;
  const personCustomers = customers.filter((customer) => customer.cpf).length;

  const allArchivedCustomers = totalAllCustomers - allActiveCustomers;
  const archivedCustomers = totalCustomers - activeCustomers;
  const archivedClients = totalClients - activeClients;

  //CUSTOMERS END
  //REQUESTS
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
  //REQUESTS END

  const colors = {
    blue: "rgba(54, 162, 235, 0.5)",
    blueBorder: "rgba(54, 162, 235, 1)",
    lightgreen: "rgba(54, 226, 235, 0.5)",
    lightgreenBorder: "rgba(54, 226, 235, 1)",
    lightpink: "rgba(255, 99, 132, 0.5)",
    lightpinkBorder: "rgba(255, 99, 132, 1)",
    orange: "rgba(255, 165, 0, 0.5)",
    orangeBorder: "rgba(255, 165, 0, 1)",
    grey: "rgba(133, 133, 133, 0.5)",
    greyBorder: "rgba(133, 133, 133, 1)",
  };

  //USERS FIRST CHART
  const allUsersData = {
    labels: [""],
    datasets: [
      {
        label: "Usuários",
        data: [totalUsers],
        backgroundColor: colors.blue,
        borderColor: colors.blueBorder,
        borderWidth: 1,
      },
      {
        label: "Gerentes",
        data: [totalManagers],
        backgroundColor: colors.lightpink,
        borderColor: colors.lightpinkBorder,
        borderWidth: 1,
      },
      {
        label: "Ativos",
        data: [allActiveUsers],
        backgroundColor: colors.lightgreen,
        borderColor: colors.lightgreenBorder,
        borderWidth: 1,
      },
      {
        label: "Arquivados",
        data: [allArchivedUsers],
        backgroundColor: colors.grey,
        borderColor: colors.greyBorder,
        borderWidth: 1,
      },
      {
        label: "Total",
        data: [totalAllUsers],
        backgroundColor: colors.orange,
        borderColor: colors.orangeBorder,
        borderWidth: 1,
      },
    ],
  };

  const allUsersOptions = {
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
  //USERS FIRST CHART END
  //USERS SECOND CHART
  const usersData = {
    labels: [""],
    datasets: [
      {
        label: "Usuários",
        data: [totalUsers],
        backgroundColor: colors.blue,
        borderColor: colors.blueBorder,
        borderWidth: 1,
      },
      {
        label: "Ativos",
        data: [activeUsers],
        backgroundColor: colors.lightgreen,
        borderColor: colors.lightgreenBorder,
        borderWidth: 1,
      },
      {
        label: "Arquivados",
        data: [archivedUsers],
        backgroundColor: colors.grey,
        borderColor: colors.greyBorder,
        borderWidth: 1,
      },
    ],
  };

  const usersOptions = {
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
  //USERS SECOND CHART END
  //USERS THIRD CHART
  const managersData = {
    labels: [""],
    datasets: [
      {
        label: "Gerentes",
        data: [totalManagers],
        backgroundColor: colors.blue,
        borderColor: colors.blueBorder,
        borderWidth: 1,
      },
      {
        label: "Ativos",
        data: [activeManagers],
        backgroundColor: colors.lightgreen,
        borderColor: colors.lightgreenBorder,
        borderWidth: 1,
      },
      {
        label: "Arquivados",
        data: [archivedManagers],
        backgroundColor: colors.grey,
        borderColor: colors.greyBorder,
        borderWidth: 1,
      },
    ],
  };

  const managersOptions = {
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
  //USERS THIRD CHART END
  //CUSTOMERS FIRST CHART
  const allCustomersData = {
    labels: [""],
    datasets: [
      {
        label: "Empresas",
        data: [companyCustomers],
        backgroundColor: colors.blue,
        borderColor: colors.blueBorder,
        borderWidth: 1,
      },
      {
        label: "Pessoa Física",
        data: [personCustomers],
        backgroundColor: colors.lightpink,
        borderColor: colors.lightpinkBorder,
        borderWidth: 1,
      },
      {
        label: "Ativos",
        data: [allActiveCustomers],
        backgroundColor: colors.lightgreen,
        borderColor: colors.lightgreenBorder,
        borderWidth: 1,
      },
      {
        label: "Arquivados",
        data: [allArchivedCustomers],
        backgroundColor: colors.grey,
        borderColor: colors.greyBorder,
        borderWidth: 1,
      },
      {
        label: "Total",
        data: [totalAllCustomers],
        backgroundColor: colors.orange,
        borderColor: colors.orangeBorder,
        borderWidth: 1,
      },
    ],
  };

  const allCustomersOptions = {
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
          boxWidth: 7,
        },
      },
    },
  };
  //CUSTOMERS FIRST CHART END
  //CUSTOMERS SECOND CHART
  const customersData = {
    labels: [""],
    datasets: [
      {
        label: "Ativos",
        data: [activeCustomers],
        backgroundColor: colors.lightgreen,
        borderColor: colors.lightgreenBorder,
        borderWidth: 1,
      },
      {
        label: "Arquivados",
        data: [archivedCustomers],
        backgroundColor: colors.grey,
        borderColor: colors.greyBorder,
        borderWidth: 1,
      },
      {
        label: "Total",
        data: [totalCustomers],
        backgroundColor: colors.orange,
        borderColor: colors.orangeBorder,
        borderWidth: 1,
      },
    ],
  };

  const customersOptions = {
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
  //CUSTOMERS SECOND CHART END
  //CUSTOMERS THIRD CHART

  const clientsData = {
    labels: [""],
    datasets: [
      {
        label: "Ativos",
        data: [activeClients],
        backgroundColor: colors.lightgreen,
        borderColor: colors.lightgreenBorder,
        borderWidth: 1,
      },
      {
        label: "Arquivados",
        data: [archivedClients],
        backgroundColor: colors.grey,
        borderColor: colors.greyBorder,
        borderWidth: 1,
      },
      {
        label: "Total",
        data: [totalClients],
        backgroundColor: colors.orange,
        borderColor: colors.orangeBorder,
        borderWidth: 1,
      },
    ],
  };

  const clientsOptions = {
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
  //CUSTOMERS THIRD CHART END

  //REQUESTS FIRST CHART
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

  //REQUESTS FIRST CHART END

  //REQUESTS SECOND CHART
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

  //REQUESTS SECOND CHART END
  //REQUESTS THIRD CHART

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

  //REQUESTS THIRD CHART END

  const chartWidth = 375;
  const chartHeight = 325;

  return (
    <>
      <Accordion sx={{ m: 2, mt: 4, mx: fromPage ? 2 : "30%" }}>
        <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
          <Typography sx={{ fontSize: 22, fontWeight: "bold", mr: 2 }}>
            Relatórios {fromPage && "Básicos"}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Accordion sx={{ mx: "30%" }}>
            <AccordionSummary>
              <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                Usuários
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid
                container
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="center"
              >
                <Grid item>
                  <Grid
                    container
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Typography sx={{ fontSize: 12 }}>Geral</Typography>
                    <div style={{ width: chartWidth, height: chartHeight }}>
                      <Bar data={allUsersData} options={allUsersOptions} />
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
                    <Typography sx={{ fontSize: 12 }}>Usuários</Typography>
                    <div style={{ width: chartWidth, height: chartHeight }}>
                      <Bar data={usersData} options={usersOptions} />
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
                    <Typography sx={{ fontSize: 12 }}>Gerentes</Typography>
                    <div style={{ width: chartWidth, height: chartHeight }}>
                      <Bar data={managersData} options={managersOptions} />
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
          <Accordion sx={{ mx: "30%", mt: 2 }}>
            <AccordionSummary>
              <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                Clientes
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid
                container
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="center"
              >
                <Grid item>
                  <Grid
                    container
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Typography sx={{ fontSize: 12 }}>Geral</Typography>
                    <div style={{ width: chartWidth, height: chartHeight }}>
                      <Bar
                        data={allCustomersData}
                        options={allCustomersOptions}
                      />
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
                    <Typography sx={{ fontSize: 12 }}>Empresas</Typography>
                    <div style={{ width: chartWidth, height: chartHeight }}>
                      <Bar data={customersData} options={customersOptions} />
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
                    <Typography sx={{ fontSize: 12 }}>Pessoa Física</Typography>
                    <div style={{ width: chartWidth, height: chartHeight }}>
                      <Bar data={clientsData} options={clientsOptions} />
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
          <Accordion sx={{ mx: "30%", mt: 2 }}>
            <AccordionSummary>
              <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                Jobs e Vendas
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid
                container
                direction="row"
                columnSpacing={1}
                alignItems="center"
                justifyContent="center"
              >
                <Grid item>
                  <Grid
                    container
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Typography sx={{ fontSize: 12 }}>
                      Geral
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
                    <Typography sx={{ fontSize: 12 }}>
                      Últimos 3 Meses
                    </Typography>
                    <div style={{ width: chartWidth, height: chartHeight }}>
                      <Bar
                        data={lastThreeMonthsRequestsData}
                        options={trimesterOptions}
                      />
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
                    <Typography sx={{ fontSize: 12 }}>
                      por Departamento
                    </Typography>
                    <div style={{ width: chartWidth, height: chartHeight }}>
                      <Bar
                        data={lastThreeMonthsRequestsData}
                        options={trimesterOptions}
                      />
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default SmartReports;
