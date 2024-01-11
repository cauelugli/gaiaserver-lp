/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import {
  Avatar,
  Menu,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  IconButton,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import DarkModeButton from "./DarkModeButton";

export default function UserButton({ user, darkMode, setDarkMode }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    sessionStorage.clear();
    toast.info("Realizando Logout", {
      closeOnClick: true,
      pauseOnHover: false,
      theme: "colored",
      autoClose: 800,
    });
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  return (
    <Box>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0.5 }}>
        <Avatar src={`http://localhost:3000/static${user.image}`} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <List sx={{ width: 180 }}>
          <Link
            to={"/account"}
            style={{
              textDecoration: "none",
              color: "black",
            }}
            onClick={() => setAnchorEl(null)}
          >
            <ListItemButton sx={{ mb: -1, ml:2 }}>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Perfil" sx={{ ml: -2 }} />
            </ListItemButton>
          </Link>

          <ListItemButton sx={{ mb: -1 }} onClick={() => setDarkMode(!darkMode)}>
            <DarkModeButton />
          </ListItemButton>

          <ListItemButton sx={{ mb: -1, ml:2 }} onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" sx={{ ml: -2 }} />
          </ListItemButton>
        </List>
      </Menu>
    </Box>
  );
}
