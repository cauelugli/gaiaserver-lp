/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link } from "react-router-dom";

import { Box, Grid, Paper, Typography } from "@mui/material";

import AssessmentIcon from "@mui/icons-material/Assessment";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AutoFixNormalIcon from "@mui/icons-material/AutoFixNormal";
import BuildIcon from "@mui/icons-material/Build";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GradingIcon from "@mui/icons-material/Grading";
import GroupIcon from "@mui/icons-material/Group";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import LanIcon from "@mui/icons-material/Lan";
import LockIcon from "@mui/icons-material/Lock";
import NotificationsIcon from "@mui/icons-material/Notifications";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import TableViewIcon from "@mui/icons-material/TableView";
import ViewSidebarIcon from "@mui/icons-material/ViewSidebar";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import WorkIcon from "@mui/icons-material/Work";

const optionsMainblocks = [
  {
    icon: <WorkIcon sx={{ fontSize: 64 }} />,
    text: "Clientes",
    link: "/customers",
  },
  {
    icon: <GradingIcon sx={{ fontSize: 64 }} />,
    text: "Solicitações",
    link: "/requests",
  },
  {
    icon: <GroupIcon sx={{ fontSize: 64 }} />,
    text: "Colaboradores",
    link: "/users",
  },
  {
    icon: <LanIcon sx={{ fontSize: 64 }} />,
    text: "Departamentos",
    link: "/departments",
  },
];

const optionsFourRowColumn = [
  {
    icon: <CalendarMonthIcon sx={{ fontSize: 32 }} />,
    text: "Agenda",
    link: "/dashboard",
  },
  {
    icon: <BuildIcon sx={{ fontSize: 32 }} />,
    text: "Serviços",
    link: "/services",
  },
  {
    icon: <RequestQuoteIcon sx={{ fontSize: 32 }} />,
    text: "Orçamentos",
    link: "/quotes",
  },
  {
    icon: <WarehouseIcon sx={{ fontSize: 32 }} />,
    text: "Estoque",
    link: "/stock",
  },
  {
    icon: <InsertDriveFileIcon sx={{ fontSize: 20 }} />,
    text: "Arquivos",
    link: "/files",
  },
  {
    icon: <LockIcon sx={{ fontSize: 20 }} />,
    text: "Segurança",
    // link: "/security",
    link: "/",
  },
];

const optionsTwoColumnsFirstColumn = [
  {
    icon: <DashboardIcon sx={{ fontSize: 16 }} />,
    text: "Dashboard",
    link: "/dashboard",
  },
  {
    icon: <RocketLaunchIcon sx={{ fontSize: 16 }} />,
    text: "Projetos",
    link: "/projects",
  },

  {
    icon: <AssessmentIcon sx={{ fontSize: 16 }} />,
    text: "Relatórios",
    link: "/reports",
  },
  {
    icon: <AttachMoneyIcon sx={{ fontSize: 16 }} />,
    text: "Financeiro",
    link: "/finance",
  },
];

const optionsTwoColumnsSecondColumn = [];

const HomeBlock = () => {
  const [hoveredIndexMainblocks, setHoveredIndexMainblocks] = useState(null);
  const [hoveredIndexFourRowColumn, setHoveredIndexFourRowColumn] =
    useState(null);
  const [
    hoveredIndexTwoColumnsFirstColumn,
    setHoveredIndexTwoColumnsFirstColumn,
  ] = useState(null);

  return (
    <Box sx={{ flexGrow: 1, overflow: "hidden", px: 2 }}>
      <Grid container>
        <Grid item xs={12} md={8}>
          <Grid container spacing={4}>
            <>
              {optionsMainblocks.map((option, index) => {
                return (
                  <Grid
                    xs={6}
                    item
                    key={index}
                    onMouseEnter={() => setHoveredIndexMainblocks(index)}
                    onMouseLeave={() => setHoveredIndexMainblocks(null)}
                  >
                    <Link to={option.link} style={{ textDecoration: "none" }}>
                      <Paper
                        sx={{
                          height: 140,
                          width: "85%",
                          p: 2,
                          transition: "background-color 0.3s, color 0.3s",
                          backgroundColor:
                            hoveredIndexMainblocks === index
                              ? "#ccc"
                              : "initial",
                          color:
                            hoveredIndexMainblocks === index ? "white" : "#777",
                        }}
                      >
                        <Grid
                          container
                          direction="column"
                          alignItems="center"
                          justifyContent="center"
                          sx={{
                            height: "100%",
                            cursor: "pointer",
                          }}
                        >
                          {option.icon}
                          <Typography
                            sx={{
                              fontSize: 18,
                              fontWeight: "bold",
                              fontFamily: "Verdana, sans-serif",
                            }}
                          >
                            {option.text}
                          </Typography>
                        </Grid>
                      </Paper>
                    </Link>
                  </Grid>
                );
              })}
              <Grid
                container
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mt: 1 }}
              >
                {optionsTwoColumnsFirstColumn.map((option, index) => {
                  return (
                    <Grid
                      xs={2}
                      item
                      sx={{
                        p: 2,
                        mx: 4,
                        transition: "background-color 0.3s, color 0.3s",
                        backgroundColor:
                          hoveredIndexTwoColumnsFirstColumn === index
                            ? "#eee"
                            : "initial",
                        color:
                          hoveredIndexTwoColumnsFirstColumn === index
                            ? "white"
                            : "#777",
                      }}
                      key={index}
                      onMouseEnter={() =>
                        setHoveredIndexTwoColumnsFirstColumn(index)
                      }
                      onMouseLeave={() =>
                        setHoveredIndexTwoColumnsFirstColumn(null)
                      }
                    >
                      <Link to={option.link} style={{ textDecoration: "none" }}>
                        <Grid
                          container
                          direction="row"
                          alignItems="center"
                          justifyContent="center"
                          sx={{
                            cursor: "pointer",
                          }}
                        >
                          {option.icon}
                          <Typography
                            sx={{
                              ml: 1,
                              fontSize: 14,
                              fontWeight: "bold",
                              fontFamily: "Verdana, sans-serif",
                            }}
                          >
                            {option.text}
                          </Typography>
                        </Grid>
                      </Link>
                    </Grid>
                  );
                })}
              </Grid>
            </>
          </Grid>
        </Grid>

        <Grid item xs={12} md={4}>
          <Grid container direction="column" spacing={3}>
            {optionsFourRowColumn.map((option, index) => {
              return (
                <Grid
                  item
                  key={index}
                  onMouseEnter={() => setHoveredIndexFourRowColumn(index)}
                  onMouseLeave={() => setHoveredIndexFourRowColumn(null)}
                >
                  <Link to={option.link} style={{ textDecoration: "none" }}>
                    <Paper
                      sx={{
                        height: 28,
                        width: "100%",
                        p: 2,
                        transition: "background-color 0.3s, color 0.3s",
                        backgroundColor:
                          hoveredIndexFourRowColumn === index
                            ? "#ccc"
                            : "initial",
                        color:
                          hoveredIndexFourRowColumn === index
                            ? "white"
                            : "#777",
                      }}
                    >
                      <Grid
                        container
                        direction="row"
                        alignItems="center"
                        justifyContent="center"
                        sx={{
                          cursor: "pointer",
                        }}
                      >
                        {option.icon}
                        <Typography
                          sx={{
                            ml: 4,
                            fontSize: 20,
                            fontWeight: "bold",
                            fontFamily: "Verdana, sans-serif",
                          }}
                        >
                          {option.text}
                        </Typography>
                      </Grid>
                    </Paper>
                  </Link>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomeBlock;
