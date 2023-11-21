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
  {
    label: "Configurações",
    icon: <SettingsIcon />,
    link: "/settings",
    disabled: true,
  },
  {
    label: "Help Center",
    icon: <HelpCenterIcon />,
    link: "/help",
    disabled: true,
  },
];

const SideBar = ({ sidebarOpen }) => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleClickOption = (index) => {
    setSelectedIndex(index);
  };

  return (
    <>
      <List>
        {options.map((option, index) => (
          <Link
            key={index}
            onClick={() => handleClickOption(index)}
            to={option.link}
            style={{
              textDecoration: "none",
              color: "black",
            }}
          >
            <ListItemButton
              selected={selectedIndex === index}
              disabled={option.disabled}
              sx={{
                color: selectedIndex === index ? "#063970" : "white",
                backgroundColor: selectedIndex === index ? "white" : "",
                "&:hover": {
                  backgroundColor: "",
                },
              }}
            >
              {option.icon}
              {sidebarOpen && (
                <Typography sx={{ ml: 1 }}>{option.label}</Typography>
              )}
            </ListItemButton>
            {option.label === "Financeiro" && <Divider sx={{ my: 0.75 }} />}
            {option.label === "Configurações" && (
              <Grid sx={{ mt: 10, mb: 0.75, pb: 0.75 }} />
            )}
          </Link>
        ))}
        <ListItemButton>
          <Grid
            container
            direction="column"
            alignItems={sidebarOpen ? "center" : ""}
          >
            <img
              src={`http://localhost:3000/static/logo_dog.png`}
              alt="Logo do Tenant"
              style={{
                width: "65%",
                cursor: "pointer",
              }}
              onClick={() => alert("GS é um sonho feito com muito amor")}
            />
            {sidebarOpen && (
              <Typography
                sx={{
                  my: 0.5,
                  fontSize: 10,
                  fontWeight: "bold",
                  color: "white",
                }}
              >
                <em>Our Roots Run Deeper</em>
              </Typography>
            )}
          </Grid>
        </ListItemButton>
      </List>
    </>
  );
};

export default SideBar;
