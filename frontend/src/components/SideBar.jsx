/* eslint-disable react/prop-types */
import React from "react";
import { Link } from "react-router-dom";

import { Divider, Grid, List, ListItemButton, Typography } from "@mui/material";

import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import BuildIcon from "@mui/icons-material/Build";
import ChatIcon from "@mui/icons-material/Chat";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GradingIcon from "@mui/icons-material/Grading";
import GroupIcon from "@mui/icons-material/Group";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import LanIcon from "@mui/icons-material/Lan";
import PersonIcon from "@mui/icons-material/Person";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import SettingsIcon from "@mui/icons-material/Settings";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import WorkIcon from "@mui/icons-material/Work";

const options = [
  { label: "Dashboard", icon: <DashboardIcon />, link: "/" },
  { label: "Clientes", icon: <WorkIcon />, link: "/customers" },
  { label: "Colaboradores", icon: <GroupIcon />, link: "/users" },
  { label: "Departamentos", icon: <LanIcon />, link: "/departments" },
  { label: "Pedidos", icon: <GradingIcon />, link: "/requests" },
  { label: "Orçamentos", icon: <RequestQuoteIcon />, link: "/quotes" },
  { label: "Serviços", icon: <BuildIcon />, link: "/services" },
  { label: "Estoque", icon: <WarehouseIcon />, link: "/stock" },
  { label: "Financeiro", icon: <AttachMoneyIcon />, link: "/finance" },
  { label: "Perfil", icon: <PersonIcon />, link: "/account" },
  { label: "Chat", icon: <ChatIcon />, link: "/", disabled: true },
  { label: "Arquivos", icon: <InsertDriveFileIcon />, link: "/files" },
  { label: "Configurações", icon: <SettingsIcon />, link: "/config" },
  {
    label: "Help Center",
    icon: <HelpCenterIcon />,
    link: "/help",
    disabled: true,
  },
];

const SideBar = ({ configData, user }) => {
  const [hoveredIndex, setHoveredIndex] = React.useState(null);

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  function hasPermission(user, configData, routePath) {
    if (!configData.sidebar) return false;
    if (user.role.name === "Admin") return true;
    const route = routePath === "/" ? "dashboard" : routePath.slice(1);
    if (route === "help" || route === "account") {
      return true;
    }

    if (!route) {
      return false;
    }

    const allowedRoles = configData.sidebar[route];
    return (
      allowedRoles && allowedRoles.some((role) => role._id === user.role.id)
    );
  }

  const filteredOptions = options.filter((option) =>
    hasPermission(user, configData, option.link)
  );

  return (
    <>
      <List>
        {filteredOptions.map((option, index) => (
          <Link
            key={index}
            onClick={() => setHoveredIndex(index)}
            to={option.link}
            style={{
              textDecoration: "none",
              color: "black",
              position: "relative",
              overflow: "hidden",

              backgroundColor:
                configData && configData.customization
                  ? configData.customization.mainColor
                  : "#32aacd",
            }}
          >
            <ListItemButton
              selected={hoveredIndex === index}
              disabled={option.disabled}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              sx={{
                color:
                  configData && configData.customization
                    ? configData.customization.fontColor
                    : "white",

                backgroundColor:
                  configData && configData.customization
                    ? configData.customization.mainColor
                    : "#32aacd",
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              {option.icon}
              <Typography
                sx={{
                  ml: 1,
                  color:
                    configData && configData.customization
                      ? configData.customization.fontColor
                      : "white",
                  backgroundColor:
                    configData && configData.customization
                      ? configData.customization.mainColor
                      : "#32aacd",
                  zIndex: 1,
                  pr: 2,
                  pl: 2,
                  py: 0.5,
                  borderRadius: 3,
                  position: "relative",
                  opacity: hoveredIndex === index ? 1 : 0,
                  transition:
                    "opacity 0.3s ease-in-out, transform 0.3s ease-in-out",
                  transform: `translateX(${
                    hoveredIndex === index ? "0" : "-100%"
                  })`,
                }}
              >
                {option.label}
              </Typography>
              <span
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor:
                    configData && configData.customization
                      ? configData.customization.mainColor
                      : "#32aacd",
                  zIndex: 0,
                  opacity: hoveredIndex === index ? 1 : 0,
                  transition: "opacity 0.3s ease-in-out",
                }}
              />
            </ListItemButton>
            {option.label === "Financeiro" && <Divider sx={{ my: 0.75 }} />}
            {option.label === "Configurações" && (
              <Grid sx={{ mt: 10, mb: 0.75, pb: 0.75 }} />
            )}
          </Link>
        ))}
        <ListItemButton>
          <img
            src={`http://localhost:3000/static/logo_dog.png`}
            alt="Logo do Tenant"
            style={{
              width: "65%",
              cursor: "pointer",
            }}
            onClick={() => alert("GS é um sonho feito com muito amor")}
          />
        </ListItemButton>
      </List>
    </>
  );
};

export default SideBar;
