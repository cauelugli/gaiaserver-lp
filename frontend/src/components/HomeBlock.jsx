/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link } from "react-router-dom";

import { Box, CircularProgress, Grid, Paper, Typography } from "@mui/material";

import AssessmentIcon from "@mui/icons-material/Assessment";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import BuildIcon from "@mui/icons-material/Build";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GradingIcon from "@mui/icons-material/Grading";
import GroupIcon from "@mui/icons-material/Group";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import LanIcon from "@mui/icons-material/Lan";
import SettingsIcon from "@mui/icons-material/Settings";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
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

const optionsFourItemsRow = [
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
    icon: <SettingsIcon sx={{ fontSize: 20 }} />,
    text: "Configurações",
    link: "/config",
  },
];

const optionsRightColumn = [
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

const HomeBlock = ({ user, configData, darkenedColor, darkMode }) => {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (configData.customization) {
      setIsLoading(false);
    }
  }, [configData, darkenedColor]);

  const [hoveredIndexMainblocks, setHoveredIndexMainblocks] = useState(null);
  const [hoveredIndexFourItemsRow, setHoveredIndexFourItemsRow] =
    useState(null);
  const [hoveredIndexRightColumn, setHoveredIndexRightColumn] = useState(null);

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
    <Box sx={{ flexGrow: 1, overflow: "hidden", pl: 4, py: 2 }}>
      <Grid container>
        <Grid item xs={12} md={9}>
          <Grid container spacing={1}>
            <>
              {optionsMainblocks.map((option, index) => {
                return (
                  <Grid xs={6} item key={index}>
                    <Link to={option.link} style={{ textDecoration: "none" }}>
                      <Paper
                        onMouseEnter={() => setHoveredIndexMainblocks(index)}
                        onMouseLeave={() => setHoveredIndexMainblocks(null)}
                        sx={{
                          height: 150,
                          width: "92%",
                          p: 2,
                          transition: "background-color 0.3s, color 0.3s",
                          backgroundColor:
                            hoveredIndexMainblocks === index &&
                            configData &&
                            configData.customization
                              ? darkMode || user.hasDarkModeActive
                                ? darkenedColor
                                : configData.customization.mainColor
                              : "white",
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
              <Grid container direction="row" sx={{ mt: 2 }}>
                {optionsRightColumn.map((option, index) => {
                  return (
                    <Grid item key={index} xs={3}>
                      <Link to={option.link} style={{ textDecoration: "none" }}>
                        <Paper
                          onMouseEnter={() => setHoveredIndexRightColumn(index)}
                          onMouseLeave={() => setHoveredIndexRightColumn(null)}
                          sx={{
                            height: 20,
                            width: 220,
                            py: 2,
                            mx: 1,
                            transition: "background-color 0.3s, color 0.3s",
                            backgroundColor:
                              hoveredIndexRightColumn === index
                                ? "white"
                                : configData && configData.customization
                                ? darkMode || user.hasDarkModeActive
                                  ? darkenedColor
                                  : configData.customization.mainColor
                                : "white",
                            color:
                              hoveredIndexRightColumn === index
                                ? "#777"
                                : "white",
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
                                ml: 1,
                                fontSize: 14,
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
            </>
          </Grid>
        </Grid>

        <Grid item xs={12} md={3} justifyContent="center" alignItems="center">
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            {optionsFourItemsRow.map((option, index) => {
              return (
                <Grid
                  item
                  key={index}
                  onMouseEnter={() => setHoveredIndexFourItemsRow(index)}
                  onMouseLeave={() => setHoveredIndexFourItemsRow(null)}
                >
                  <Link to={option.link} style={{ textDecoration: "none" }}>
                    <Paper
                      sx={{
                        height: 28,
                        width: 240,
                        py: 2,
                        transition: "background-color 0.3s, color 0.3s",
                        backgroundColor:
                          hoveredIndexFourItemsRow === index
                            ? "white"
                            : configData && configData.customization
                            ? darkMode || user.hasDarkModeActive
                              ? darkenedColor
                              : configData.customization.mainColor
                            : "white",
                        color:
                          hoveredIndexFourItemsRow === index ? "#777" : "white",
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
                            ml: option.text === "Orçamentos" ? 1 : 2,
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
