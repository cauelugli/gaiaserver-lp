import React from "react";
import { Link } from "react-router-dom";

import {
  Box,
  Button,
  Divider,
  Grid,
  List,
  ListItemButton,
  Paper,
  Typography,
} from "@mui/material";

import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

import ComputerIcon from "@mui/icons-material/Computer";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GradingIcon from "@mui/icons-material/Grading";
import GroupIcon from "@mui/icons-material/Group";
import LanIcon from "@mui/icons-material/Lan";
import SettingsIcon from "@mui/icons-material/Settings";
import WorkIcon from "@mui/icons-material/Work";

const SideBar = ({ sidebarOpen }) => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleClickOption = (index) => {
    setSelectedIndex(index);
  };

  return (
    <List>
      <Link
        to="/"
        style={{
          textDecoration: "none",
          color: "black",
        }}
      >
        <ListItemButton
          selected={selectedIndex === 0}
          onClick={""}
          sx={{
            color: selectedIndex === 0 ? "white" : "",
            "&:hover": {
              backgroundColor: "#aaa",
            },
          }}
        >
          <DashboardIcon />
          {sidebarOpen && <Typography sx={{ ml: 1 }}>Dashboard</Typography>}
        </ListItemButton>
      </Link>
      <Link
        to="/users"
        style={{
          textDecoration: "none",
          color: "black",
        }}
      >
        <ListItemButton
          selected={selectedIndex === 1}
          onClick={""}
          sx={{
            color: selectedIndex === 1 ? "white" : "",
            "&:hover": {
              backgroundColor: "#aaa",
            },
          }}
        >
          <GroupIcon />
          {sidebarOpen && <Typography sx={{ ml: 1 }}>Funcionários</Typography>}
        </ListItemButton>
      </Link>
      <ListItemButton
        selected={selectedIndex === 2}
        onClick={""}
        disabled
        sx={{
          color: selectedIndex === 2 ? "white" : "",
          "&:hover": {
            backgroundColor: "#aaa",
          },
        }}
      >
        <ComputerIcon />
        {sidebarOpen && <Typography sx={{ ml: 1 }}>Ativos</Typography>}
      </ListItemButton>
      <ListItemButton
        selected={selectedIndex === 3}
        onClick={""}
        disabled
        sx={{
          color: selectedIndex === 3 ? "white" : "",
          "&:hover": {
            backgroundColor: "#aaa",
          },
        }}
      >
        <LanIcon />
        {sidebarOpen && <Typography sx={{ ml: 1 }}>Departamentos</Typography>}
      </ListItemButton>
      <ListItemButton
        selected={selectedIndex === 4}
        onClick={""}
        disabled
        sx={{
          color: selectedIndex === 4 ? "white" : "",
          "&:hover": {
            backgroundColor: "#aaa",
          },
        }}
      >
        <GradingIcon />
        {sidebarOpen && <Typography sx={{ ml: 1 }}>Jobs</Typography>}
      </ListItemButton>
      <ListItemButton
        selected={selectedIndex === 5}
        onClick={""}
        disabled
        sx={{
          color: selectedIndex === 5 ? "white" : "",
          "&:hover": {
            backgroundColor: "#aaa",
          },
        }}
      >
        <AttachMoneyIcon />
        {sidebarOpen && <Typography sx={{ ml: 1 }}>Financeiro</Typography>}
      </ListItemButton>
      <Divider sx={{ my: 2 }} />
      <Link
        to="/customers"
        style={{
          textDecoration: "none",
          color: "black",
        }}
      >
        <ListItemButton
          selected={selectedIndex === 6}
          onClick={""}
          sx={{
            color: selectedIndex === 6 ? "white" : "",
            "&:hover": {
              backgroundColor: "#aaa",
            },
          }}
        >
          <WorkIcon />
          {sidebarOpen && <Typography sx={{ ml: 1 }}>Clientes</Typography>}
        </ListItemButton>
      </Link>
      <ListItemButton
        selected={selectedIndex === 7}
        disabled
        onClick={""}
        sx={{
          color: selectedIndex === 7 ? "white" : "",
          "&:hover": {
            backgroundColor: "#aaa",
          },
        }}
      >
        <SettingsIcon />
        {sidebarOpen && <Typography sx={{ ml: 1 }}>Configurações</Typography>}
      </ListItemButton>
    </List>
  );
};

export default SideBar;
