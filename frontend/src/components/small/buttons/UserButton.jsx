/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";

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
import LogoutIcon from '@mui/icons-material/Logout';

export default function UserButton(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (menuIndex) => {
    setAnchorEl(null);
    props.openModal(menuIndex);
  };

  return (
    <div style={{ cursor: "pointer" }}>
      <Avatar
        // src="user-image"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        size="small"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        variant="outlined"
        sx={{
          mx: 1,
          "&:hover": { borderColor: "#eee" },
        }}
      />
      <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
        <List sx={{ width: 180 }}>
          <ListItemButton onClick={() => handleMenuItemClick(0)}>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Meu Perfil" sx={{ ml: -2 }} />
          </ListItemButton>
          <ListItemButton onClick={() => handleMenuItemClick(1)}>
            <ListItemIcon>
              <GradingIcon />
            </ListItemIcon>
            <ListItemText primary="Meus Pedidos" sx={{ ml: -2 }} />
          </ListItemButton>
          <ListItemButton onClick={() => handleMenuItemClick(2)}>
            <ListItemIcon>
              <NotificationsIcon />
            </ListItemIcon>
            <ListItemText primary="Notificações" sx={{ ml: -2 }} />
          </ListItemButton>
          <Divider sx={{my:1}}/>
          <ListItemButton sx={{mb:-1}} onClick={() => handleMenuItemClick(3)}>
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
