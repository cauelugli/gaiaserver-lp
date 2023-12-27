/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { toast } from "react-toastify";

import {
  Menu,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  IconButton,
} from "@mui/material";

import NotificationsIcon from "@mui/icons-material/Notifications";

export default function NotificationsButton({ user }) {
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);

  const handleOpenNotifications = (e) => {
    setNotificationsAnchorEl(e.currentTarget);
  };

  const handleCloseNotifications = () => {
    setNotificationsAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleOpenNotifications}>
        <NotificationsIcon />
      </IconButton>

      {user.notifications ? (
        <Menu
          anchorEl={notificationsAnchorEl}
          open={Boolean(notificationsAnchorEl)}
          onClose={handleCloseNotifications}
        >
          <List>
            {Object.keys(user.notifications).map((key) => (
              <ListItemButton key={key}>
                <ListItemText primary={user.notifications[key].body} />
              </ListItemButton>
            ))}
          </List>
        </Menu>
      ) : (
        <Menu
          anchorEl={notificationsAnchorEl}
          open={Boolean(notificationsAnchorEl)}
          onClose={handleCloseNotifications}
        >
          <List>
            <ListItemButton>
              <ListItemText primary="Não há Novas Notificações" />
            </ListItemButton>
          </List>
        </Menu>
      )}
    </>
  );
}
