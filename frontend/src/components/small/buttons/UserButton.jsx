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
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import GradingIcon from "@mui/icons-material/Grading";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";

export default function UserButton() {
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
    <div style={{ cursor: "pointer" }}>
      <Avatar
        // src="user-image"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        size="small"
        aria-expanded={open ? "true" : undefined}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        variant="outlined"
        sx={{
          mx: 1,
          "&:hover": { borderColor: "#eee" },
        }}
      />
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
              <ListItemText primary="Meu Perfil" sx={{ ml: -2 }} />
            </ListItemButton>
          </Link>

          <ListItemButton>
            <ListItemIcon>
              <GradingIcon />
            </ListItemIcon>
            <ListItemText primary="Meus Pedidos" sx={{ ml: -2 }} />
          </ListItemButton>

          <ListItemButton>
            <ListItemIcon>
              <NotificationsIcon />
            </ListItemIcon>
            <ListItemText primary="Notificações" sx={{ ml: -2 }} />
          </ListItemButton>

          <Divider sx={{ my: 1 }} />

          <ListItemButton
            sx={{ mb: -1 }}
            onClick={handleLogout}
          >
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" sx={{ ml: -2 }} />
          </ListItemButton>
        </List>
      </Menu>
    </div>
  );
}
