/* eslint-disable react/prop-types */
import React from "react";
import { Link } from "react-router-dom";

import { Divider, Grid, List, ListItemButton, Typography } from "@mui/material";

import { icons } from "../../icons";

const options = [
  { label: "Dashboard", icon: <icons.DashboardIcon />, link: "/", disabled: true },
  { label: "Clientes", icon: <icons.WorkIcon />, link: "/customers" },
  { label: "Solicitações", icon: <icons.GradingIcon />, link: "/requests" },
  { label: "Colaboradores", icon: <icons.GroupIcon />, link: "/users" },
  { label: "Departamentos", icon: <icons.LanIcon />, link: "/departments" },
  { label: "Serviços", icon: <icons.BuildIcon />, link: "/services" },
  { label: "Orçamentos", icon: <icons.RequestQuoteIcon />, link: "/quotes" },
  { label: "Produtos", icon: <icons.SellIcon />, link: "/products" },
  { label: "Estoque", icon: <icons.WarehouseIcon />, link: "/stock" },
  { label: "Chat", icon: <icons.ChatIcon />, link: "/", disabled: true },
  { label: "Financeiro", icon: <icons.AttachMoneyIcon />, link: "/finance" },
  { label: "Relatórios", icon: <icons.AssessmentIcon />, link: "/reports" },
  {
    label: "Acessos",
    icon: <icons.AdminPanelSettingsIcon />,
    link: "/security",
  },

  { label: "Arquivos", icon: <icons.InsertDriveFileIcon />, link: "/files" },
  { label: "Configurações", icon: <icons.SettingsIcon />, link: "/config" },
  {
    label: "Help Center",
    icon: <icons.HelpCenterIcon />,
    link: "/help",
    disabled: true,
  },
];

const TopBar = ({ configData, user }) => {
  const [hoveredIndex, setHoveredIndex] = React.useState(null);
  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  function hasPermission(user, configData, routePath) {
    if (user.username === "admin") return true;
    if (!configData.permissions) return false;

    const route = routePath.slice(1);
    if (route === "" || route === "help" || route === "account") {
      return true;
    }

    if (!route) {
      return false;
    }

    const allowedRoles = configData.permissions[route];
    return allowedRoles && allowedRoles.some((id) => id === user.role);
  }

  const filteredOptions = options.filter((option) =>
    hasPermission(user, configData, option.link)
  );

  return (
    <>
      <List
        sx={{
          display: "flex",
          flexDirection: "row",
          mb: 1,
          backgroundColor:
            configData && configData.customization
              ? configData.customization.mainColor
              : "white",
        }}
      >
        <Link to="/">
          <ListItemButton
            sx={{
              backgroundColor:
                configData && configData.customization
                  ? configData.customization.mainColor
                  : "white",
            }}
          >
            <icons.HomeIcon
              sx={{
                color:
                  configData && configData.customization
                    ? configData.customization.fontColor
                    : "white",

                backgroundColor:
                  configData && configData.customization
                    ? configData.customization.mainColor
                    : "white",
              }}
            />
          </ListItemButton>
        </Link>
        {filteredOptions.map((option, index) => (
          <Grid key={index}>
            {option.label === "Acessos" && (
              <Divider orientation="vertical" flexItem />
            )}
            <Link
              to={option.link}
              style={{
                textDecoration: "none",
                color: "black",
                position: "relative",
                backgroundColor:
                  configData && configData.customization
                    ? configData.customization.mainColor
                    : "white",
              }}
            >
              <ListItemButton
                selected={hoveredIndex === index}
                disabled={option.disabled}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                sx={{
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  color:
                    configData && configData.customization
                      ? configData.customization.fontColor
                      : "white",
                  backgroundColor:
                    configData && configData.customization
                      ? configData.customization.mainColor
                      : "white",
                }}
              >
                {option.icon}
                <Typography
                  sx={{
                    position: "absolute",
                    bottom: -20,
                    textAlign: "center",
                    fontSize: 13,
                    opacity: hoveredIndex === index ? 1 : 0,
                    transition: "opacity 0.3s ease-in-out",
                    padding: "2px 0",
                  }}
                >
                  {option.label}
                </Typography>
              </ListItemButton>
            </Link>
          </Grid>
        ))}
      </List>
    </>
  );
};

export default TopBar;
