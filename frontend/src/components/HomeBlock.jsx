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
import Shortcuts from "./small/Shortcuts";

const optionsMainblocks = [
  {
    icon: <WorkIcon sx={{ fontSize: 64 }} />,
    text: "Clientes",
    link: "/customers",
    permissionLabel: "customers",
  },
  {
    icon: <GradingIcon sx={{ fontSize: 64 }} />,
    text: "Solicitações",
    link: "/requests",
    permissionLabel: "requests",
  },
  {
    icon: <GroupIcon sx={{ fontSize: 64 }} />,
    text: "Colaboradores",
    link: "/users",
    permissionLabel: "users",
  },
  {
    icon: <LanIcon sx={{ fontSize: 64 }} />,
    text: "Departamentos",
    link: "/departments",
    permissionLabel: "departments",
  },
];

const optionsRightColumn = [
  {
    icon: <CalendarMonthIcon sx={{ fontSize: 26 }} />,
    text: "Agenda",
    link: "/dashboard",
    permissionLabel: "dashboard",
  },
  {
    icon: <BuildIcon sx={{ fontSize: 26 }} />,
    text: "Serviços",
    link: "/services",
    permissionLabel: "services",
  },
  {
    icon: <RequestQuoteIcon sx={{ fontSize: 26 }} />,
    text: "Orçamentos",
    link: "/quotes",
    permissionLabel: "quotes",
  },
  {
    icon: <WarehouseIcon sx={{ fontSize: 26 }} />,
    text: "Estoque",
    link: "/stock",
    permissionLabel: "stock",
  },
  {
    icon: <InsertDriveFileIcon sx={{ fontSize: 26 }} />,
    text: "Arquivos",
    link: "/files",
    permissionLabel: "files",
  },
  {
    icon: <SettingsIcon sx={{ fontSize: 26 }} />,
    text: "Configurações",
    link: "/config",
    permissionLabel: "config",
  },
];

const optionsFourItemsRow = [
  {
    icon: <DashboardIcon sx={{ fontSize: 28 }} />,
    text: "Dashboard",
    link: "/dashboard",
    permissionLabel: "dashboard",
  },
  {
    icon: <RocketLaunchIcon sx={{ fontSize: 28 }} />,
    text: "Projetos",
    link: "/projects",
    permissionLabel: "projects",
  },

  {
    icon: <AssessmentIcon sx={{ fontSize: 28 }} />,
    text: "Relatórios",
    link: "/reports",
    permissionLabel: "reports",
  },
  {
    icon: <AttachMoneyIcon sx={{ fontSize: 28 }} />,
    text: "Financeiro",
    link: "/finance",
    permissionLabel: "finance",
  },
];

const HomeBlock = ({
  user,
  allowedLinks,
  configData,
  darkenedColor,
  darkMode,
}) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const uniqueAllowedLinks = [...new Set(allowedLinks)];

  console.log("uniqueAllowedLinks",uniqueAllowedLinks)

  const allowedListMainblocks = uniqueAllowedLinks.filter((link) =>
    ["customers", "users", "departments", "requests"].includes(link)
  );

  const allowedListRightColumn = uniqueAllowedLinks.filter((link) =>
    ["agenda", "services", "quotes", "stock", "files", "config"].includes(link)
  );

  const allowedListFourItemsRow = uniqueAllowedLinks.filter((link) =>
    ["dashboard", "projects", "reports", "finance"].includes(link)
  );

  React.useEffect(() => {
    if (configData.customization && allowedListMainblocks.length) {
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
        <Grid
          item
          xs={
            allowedListMainblocks.length === 4
              ? 12
              : allowedListMainblocks.length === 3
              ? 12
              : allowedListMainblocks.length === 2
              ? 12
              : 12
          }
          md={
            allowedListMainblocks.length === 4
              ? 9
              : allowedListMainblocks.length === 3
              ? 9
              : allowedListMainblocks.length === 2
              ? 9
              : 9
          }
        >
          <Grid container rowSpacing={1} sx={{ backgroundColor: "red" }}>
            <>
              {optionsMainblocks.map((option, index) => {
                if (allowedListMainblocks.includes(option.permissionLabel)) {
                  return (
                    <Grid
                      item
                      key={index}
                      xs={
                        allowedListMainblocks.length === 4
                          ? 6
                          : allowedListMainblocks.length === 3
                          ? 9
                          : allowedListMainblocks.length === 2
                          ? 12
                          : 12
                      }
                      sx={{ backgroundColor: "blue" }}
                    >
                      <Link to={option.link} style={{ textDecoration: "none" }}>
                        <Paper
                          onMouseEnter={() => setHoveredIndexMainblocks(index)}
                          onMouseLeave={() => setHoveredIndexMainblocks(null)}
                          sx={{
                            height:
                              allowedListMainblocks.length === 4
                                ? 150
                                : allowedListMainblocks.length === 3
                                ? 80
                                : allowedListMainblocks.length === 2
                                ? 75
                                : 75,

                            width:
                              allowedListMainblocks.length === 4
                                ? "95%"
                                : allowedListMainblocks.length === 3
                                ? "60%"
                                : allowedListMainblocks.length === 2
                                ? "75%"
                                : "75%",

                            ml:
                              allowedListMainblocks.length === 4
                                ? ""
                                : allowedListMainblocks.length === 3
                                ? "auto"
                                : allowedListMainblocks.length === 2
                                ? ""
                                : "",
                            my:
                              allowedListMainblocks.length === 4
                                ? ""
                                : allowedListMainblocks.length === 3
                                ? 1
                                : allowedListMainblocks.length === 2
                                ? ""
                                : "",
                            p:
                              allowedListMainblocks.length === 4
                                ? 1
                                : allowedListMainblocks.length === 3
                                ? 1.5
                                : allowedListMainblocks.length === 2
                                ? 2
                                : 2,

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
                              hoveredIndexMainblocks === index
                                ? "white"
                                : "#777",
                          }}
                        >
                          <Grid
                            container
                            direction="column"
                            alignItems="center"
                            justifyContent="center"
                            sx={{
                              height:
                                allowedListMainblocks.length === 4
                                  ? "100%"
                                  : allowedListMainblocks.length === 3
                                  ? "none"
                                  : allowedListMainblocks.length === 2
                                  ? "none"
                                  : "none",
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
                } else {
                  return null;
                }
              })}
              <Grid
                container
                direction="row"
                justifyContent="space-between"
                sx={{ mt: 2, backgroundColor: "yellow" }}
              >
                {optionsFourItemsRow.map((option, index) => {
                  if (allowedListFourItemsRow.includes(option.permissionLabel)) {
                    return (
                      <Grid
                        item
                        key={index}
                        onMouseEnter={() => setHoveredIndexFourItemsRow(index)}
                        onMouseLeave={() => setHoveredIndexFourItemsRow(null)}
                      >
                        <Link
                          to={option.link}
                          style={{ textDecoration: "none" }}
                        >
                          <Paper
                            sx={{
                              height: 28,
                              width: 220,
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
                                hoveredIndexFourItemsRow === index
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
                  }
                })}
              </Grid>
            </>
          </Grid>
        </Grid>

        <Grid
          item
          xs={12}
          md={3}
          justifyContent="center"
          alignItems="center"
          sx={{ backgroundColor: "green" }}
        >
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            rowSpacing={2}
          >
            <Grid sx={{ backgroundColor: "papayawhip" }}>
              <Shortcuts />
            </Grid>
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
                          hoveredIndexRightColumn === index ? "#777" : "white",
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
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomeBlock;
