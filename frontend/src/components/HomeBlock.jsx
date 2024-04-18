/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link } from "react-router-dom";

import { Grid, Paper, Typography } from "@mui/material";

import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
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
import HomeRecentActivity from "./small/HomeRecentActivity";

const optionsMainblocks = [
  {
    icon: <WorkIcon sx={{ fontSize: 60 }} />,
    text: "Clientes",
    link: "/customers",
    permissionLabel: "customers",
  },
  {
    icon: <GradingIcon sx={{ fontSize: 60 }} />,
    text: "Solicitações",
    link: "/requests",
    permissionLabel: "requests",
  },
  {
    icon: <GroupIcon sx={{ fontSize: 60 }} />,
    text: "Colaboradores",
    link: "/users",
    permissionLabel: "users",
  },
  {
    icon: <LanIcon sx={{ fontSize: 60 }} />,
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
    icon: <AdminPanelSettingsIcon sx={{ fontSize: 26 }} />,
    text: "Acessos",
    link: "/security",
    permissionLabel: "security",
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
    icon: <DashboardIcon sx={{ fontSize: 20 }} />,
    text: "Dashboard",
    link: "/dashboard",
    permissionLabel: "dashboard",
  },
  {
    icon: <RocketLaunchIcon sx={{ fontSize: 20 }} />,
    text: "Projetos",
    link: "/projects",
    permissionLabel: "projects",
  },

  {
    icon: <AssessmentIcon sx={{ fontSize: 20 }} />,
    text: "Relatórios",
    link: "/reports",
    permissionLabel: "reports",
  },
  {
    icon: <AttachMoneyIcon sx={{ fontSize: 20 }} />,
    text: "Financeiro",
    link: "/finance",
    permissionLabel: "finance",
  },
];

const HomeBlock = ({ userUsername, allowedLinks, configData }) => {
  const uniqueAllowedLinks = [...new Set(allowedLinks)];

  const allowedListMainblocks = uniqueAllowedLinks.filter((link) =>
    ["customers", "users", "departments", "requests"].includes(link)
  );

  const allowedListRightColumn = uniqueAllowedLinks.filter((link) =>
    [
      "agenda",
      "services",
      "quotes",
      "stock",
      "files",
      "security",
      "config",
    ].includes(link)
  );

  const allowedListFourItemsRow = uniqueAllowedLinks.filter((link) =>
    ["dashboard", "projects", "reports", "finance"].includes(link)
  );

  React.useEffect(() => {}, [configData]);

  const [hoveredIndexMainblocks, setHoveredIndexMainblocks] = useState(null);
  const [hoveredIndexFourItemsRow, setHoveredIndexFourItemsRow] =
    useState(null);
  const [hoveredIndexRightColumn, setHoveredIndexRightColumn] = useState(null);

  return (
    <Grid container direction="row" justifyContent="space-evenly">
      <Grid item>
        <Grid container direction="column">
          <>
            <Grid
              container
              direction="row"
              alignItems="center"
              justifyContent="center"
            >
              {optionsMainblocks.map((option, index) => {
                if (allowedListMainblocks.includes(option.permissionLabel)) {
                  return (
                    <Grid
                      item
                      key={index}
                      sx={{ m: 2 }}
                      md={allowedListMainblocks.length === 2 ? 12 : 5}
                    >
                      <Link to={option.link} style={{ textDecoration: "none" }}>
                        <Paper
                          onMouseEnter={() => setHoveredIndexMainblocks(index)}
                          onMouseLeave={() => setHoveredIndexMainblocks(null)}
                          sx={{
                            height: 130,
                            width: "auto",
                            transition: "background-color 0.3s, color 0.3s",
                            backgroundColor:
                              hoveredIndexMainblocks === index &&
                              configData &&
                              configData.customization
                                ? configData.customization.mainColor
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
                } else {
                  return null;
                }
              })}
            </Grid>

            <Grid
              container
              direction="row"
              sx={{ my: 2 }}
              justifyContent="space-between"
            >
              {optionsFourItemsRow.map((option, index) => {
                if (allowedListFourItemsRow.includes(option.permissionLabel)) {
                  return (
                    <Grid
                      item
                      sx={{ mx: 1 }}
                      key={index}
                      onMouseEnter={() => setHoveredIndexFourItemsRow(index)}
                      onMouseLeave={() => setHoveredIndexFourItemsRow(null)}
                    >
                      <Link to={option.link} style={{ textDecoration: "none" }}>
                        <Paper
                          sx={{
                            width: 120,
                            py: 1,
                            px: 2,
                            transition: "background-color 0.3s, color 0.3s",
                            backgroundColor:
                              hoveredIndexFourItemsRow === index
                                ? "white"
                                : configData && configData.customization
                                ? configData.customization.mainColor
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
                                fontSize: 16,
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

            <Grid container>
              <HomeRecentActivity
                userUsername={userUsername}
                mainColor={
                  configData.customization && configData.customization.mainColor
                }
              />
            </Grid>
          </>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container direction="column">
          <Grid item xs={12} md={3} justifyContent="center" alignItems="center">
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
              rowSpacing={4}
            >
              {optionsRightColumn.map((option, index) => {
                if (allowedListRightColumn.includes(option.permissionLabel)) {
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
                            mx: 1.5,
                            transition: "background-color 0.3s, color 0.3s",
                            backgroundColor:
                              hoveredIndexRightColumn === index
                                ? "white"
                                : configData && configData.customization
                                ? configData.customization.mainColor
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
                }
              })}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default HomeBlock;
