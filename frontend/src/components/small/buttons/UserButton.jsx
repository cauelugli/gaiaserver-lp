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
  Divider,
  Box,
  IconButton,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";

export default function UserButton({ user }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

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
      <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
        <List sx={{ width: 180 }}>
          <Link
            to={"/account"}
            style={{
              textDecoration: "none",
              color: "black",
            }}
            onClick={() => setAnchorEl(null)}
          >
            <ListItemButton>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Perfil" sx={{ ml: -2 }} />
            </ListItemButton>
          </Link>

          <ListItemButton>
            <ListItemIcon>
              <NotificationsIcon />
            </ListItemIcon>
            <ListItemText primary="Notificações" sx={{ ml: -2 }} />
          </ListItemButton>

          <Divider sx={{ my: 1 }} />

          <ListItemButton sx={{ mb: -1 }} onClick={handleLogout}>
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
