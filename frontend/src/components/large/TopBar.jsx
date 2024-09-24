/* eslint-disable react/prop-types */
import React from "react";
import { Link } from "react-router-dom";

import { Divider, List, ListItemButton, Typography } from "@mui/material";

import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AssessmentIcon from "@mui/icons-material/Assessment";
import BuildIcon from "@mui/icons-material/Build";
import ChatIcon from "@mui/icons-material/Chat";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GradingIcon from "@mui/icons-material/Grading";
import GroupIcon from "@mui/icons-material/Group";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import HomeIcon from "@mui/icons-material/Home";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import LanIcon from "@mui/icons-material/Lan";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import SettingsIcon from "@mui/icons-material/Settings";
import SellIcon from "@mui/icons-material/Sell";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import WorkIcon from "@mui/icons-material/Work";

const options = [
  { label: "Dashboard", icon: <DashboardIcon />, link: "/", disabled: true },
  { label: "Clientes", icon: <WorkIcon />, link: "/customers" },
  { label: "Solicitações", icon: <GradingIcon />, link: "/requests" },
  { label: "Colaboradores", icon: <GroupIcon />, link: "/users" },
  { label: "Departamentos", icon: <LanIcon />, link: "/departments" },
  { label: "Serviços", icon: <BuildIcon />, link: "/services" },
  { label: "Orçamentos", icon: <RequestQuoteIcon />, link: "/quotes" },
  { label: "Produtos", icon: <SellIcon />, link: "/products" },
  { label: "Estoque", icon: <WarehouseIcon />, link: "/stock" },
  { label: "Chat", icon: <ChatIcon />, link: "/", disabled: true },
  { label: "Financeiro", icon: <AttachMoneyIcon />, link: "/finance" },
  { label: "Relatórios", icon: <AssessmentIcon />, link: "/reports" },
  {
    label: "Acessos",
    icon: <AdminPanelSettingsIcon />,
    link: "/security",
  },

  { label: "Arquivos", icon: <InsertDriveFileIcon />, link: "/files" },
  { label: "Configurações", icon: <SettingsIcon />, link: "/config" },
  {
    label: "Help Center",
    icon: <HelpCenterIcon />,
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
    return allowedRoles && allowedRoles.some((id) => id === user.role.id);
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
          // overflow: "visible",
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
            <HomeIcon
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
          <>
            {option.label === "Acessos" && (
              <Divider orientation="vertical" flexItem />
            )}
            <Link
              key={index}
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
          </>
        ))}
      </List>
    </>
  );
};

export default TopBar;
