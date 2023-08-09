/* eslint-disable react/prop-types */
import React from "react";
import { Link } from "react-router-dom";

import { Divider, List, ListItemButton, Typography } from "@mui/material";

import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

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
        onClick={() => handleClickOption(0)}
        to="/"
        style={{
          textDecoration: "none",
          color: "black",
        }}
      >
        <ListItemButton
          selected={selectedIndex === 0}
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
        onClick={() => handleClickOption(1)}
        to="/users"
        style={{
          textDecoration: "none",
          color: "black",
        }}
      >
        <ListItemButton
          selected={selectedIndex === 1}
          sx={{
            color: selectedIndex === 1 ? "white" : "",
            "&:hover": {
              backgroundColor: "#aaa",
            },
          }}
        >
          <GroupIcon />
          {sidebarOpen && <Typography sx={{ ml: 1 }}>Colaboradores</Typography>}
        </ListItemButton>
      </Link>
      <Link
        onClick={() => handleClickOption(3)}
        to="/departments"
        style={{
          textDecoration: "none",
          color: "black",
        }}
      >
        <ListItemButton
          selected={selectedIndex === 3}
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
      </Link>

      <ListItemButton
        selected={selectedIndex === 4}
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
        onClick={() => handleClickOption(6)}
        to="/customers"
        style={{
          textDecoration: "none",
          color: "black",
        }}
      >
        <ListItemButton
          selected={selectedIndex === 6}
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
