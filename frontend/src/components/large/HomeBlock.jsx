/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link } from "react-router-dom";

import { Grid, Paper } from "@mui/material";

import { icons } from '../../icons'

import HomeRecentActivity from "../small/HomeRecentActivity";

const optionsMainblocks = [
  {
    icon: <icons.WorkIcon sx={{ fontSize: 52 }} />,
    text: "Clientes",
    link: "/customers",
    permissionLabel: "customers",
  },
  {
    icon: <icons.GradingIcon sx={{ fontSize: 52 }} />,
    text: "Solicitações",
    link: "/requests",
    permissionLabel: "requests",
  },
  {
    icon: <icons.GroupIcon sx={{ fontSize: 52 }} />,
    text: "Colaboradores",
    link: "/users",
    permissionLabel: "users",
  },
  {
    icon: <icons.LanIcon sx={{ fontSize: 52 }} />,
    text: "Departamentos",
    link: "/departments",
    permissionLabel: "departments",
  },
  {
    icon: <icons.SellIcon sx={{ fontSize: 52 }} />,
    text: "Produtos",
    link: "/products",
    permissionLabel: "products",
  },
  {
    icon: <icons.WarehouseIcon sx={{ fontSize: 52 }} />,
    text: "Estoque",
    link: "/stock",
    permissionLabel: "stock",
  },
  {
    icon: <icons.BuildIcon sx={{ fontSize: 52 }} />,
    text: "Serviços",
    link: "/services",
    permissionLabel: "services",
  },

  {
    icon: <icons.AttachMoneyIcon sx={{ fontSize: 52 }} />,
    text: "Financeiro",
    link: "/finance",
    permissionLabel: "finance",
  },
];

const optionsRightColumn = [
  {
    icon: <icons.DashboardIcon sx={{ fontSize: 22 }} />,
    text: "Dashboard",
    link: "/dashboard",
    permissionLabel: "dashboard",
  },
  {
    icon: <icons.AssessmentIcon sx={{ fontSize: 22 }} />,
    text: "Relatórios",
    link: "/reports",
    permissionLabel: "reports",
  },
  {
    icon: <icons.RequestQuoteIcon sx={{ fontSize: 22 }} />,
    text: "Orçamentos",
    link: "/quotes",
    permissionLabel: "quotes",
  },
  {
    icon: <icons.AdminPanelSettingsIcon sx={{ fontSize: 22 }} />,
    text: "Acessos",
    link: "/security",
    permissionLabel: "security",
  },
  {
    icon: <icons.InsertDriveFileIcon sx={{ fontSize: 22 }} />,
    text: "Arquivos",
    link: "/files",
    permissionLabel: "files",
  },
  {
    icon: <icons.SettingsIcon sx={{ fontSize: 22 }} />,
    text: "Configurações",
    link: "/config",
    permissionLabel: "config",
  },
];

const HomeBlock = ({ userUsername, allowedLinks, configData }) => {
  const uniqueAllowedLinks = [...new Set(allowedLinks)];

  const allowedListMainblocks = uniqueAllowedLinks.filter((link) =>
    [
      "customers",
      "users",
      "departments",
      "requests",
      "products",
      "stock",
      "services",
      "finance",
    ].includes(link)
  );

  const allowedListRightColumn = uniqueAllowedLinks.filter((link) =>
    ["quotes", "files", "security", "dashboard", "reports", "config"].includes(
      link
    )
  );

  React.useEffect(() => {}, [configData]);

  const [hoveredIndexMainblocks, setHoveredIndexMainblocks] = useState(null);
  const [hoveredIndexRightColumn, setHoveredIndexRightColumn] = useState(null);

  return (
    <Grid
      container
      direction="row"
      justifyContent={
        allowedListRightColumn.length === 0 ? "center" : "space-evenly"
      }
    >
      <Grid item>
        <Grid container direction="column">
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
                    sx={{
                      pr: index % 2 === 1 ? "" : 1,
                      pb: 1,
                    }}
                    md={allowedListMainblocks.length <= 4 ? 12 : 6}
                  >
                    <Link to={option.link} style={{ textDecoration: "none" }}>
                      <Paper
                        onMouseEnter={() => setHoveredIndexMainblocks(index)}
                        onMouseLeave={() => setHoveredIndexMainblocks(null)}
                        sx={{
                          height: 110,
                          width: "auto",
                          maxWidth: 692,
                          transition: "background-color 0.3s, color 0.3s",
                          backgroundColor:
                            hoveredIndexMainblocks === index &&
                            configData &&
                            configData.customization
                              ? configData.customization.mainColor
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
                          <span
                            style={{
                              fontSize: 14,
                              fontWeight: "bold",
                              fontFamily: "Verdana, sans-serif",
                            }}
                          >
                            {option.text}
                          </span>
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

          {/* <Grid container>
            <HomeRecentActivity
              userUsername={userUsername}
              mainColor={
                configData.customization && configData.customization.mainColor
              }
            />
          </Grid> */}
        </Grid>
      </Grid>
      <Grid item sx={{ height: "auto" }}>
        <Grid
          container
          direction="column"
          sx={{ height: "85%", maxHeight: 480 }}
        >
          {optionsRightColumn.map((option, index) => {
            if (allowedListRightColumn.includes(option.permissionLabel)) {
              return (
                <Grid item key={index} sx={{ mb: "auto" }}>
                  <Link
                    to={option.link}
                    style={{
                      textDecoration: "none",
                    }}
                  >
                    <Paper
                      onMouseEnter={() => setHoveredIndexRightColumn(index)}
                      onMouseLeave={() => setHoveredIndexRightColumn(null)}
                      sx={{
                        width: 180,
                        py: 1.5,
                        mx: 1,
                        transition: "background-color 0.3s, color 0.3s",
                        backgroundColor:
                          hoveredIndexRightColumn === index
                            ? "white"
                            : configData && configData.customization
                            ? configData.customization.mainColor
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
                        <span
                          style={{
                            marginLeft: 10,
                            fontSize: 14,
                            fontWeight: "bold",
                            fontFamily: "Verdana, sans-serif",
                          }}
                        >
                          {option.text}
                        </span>
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
  );
};

export default HomeBlock;
