/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";

import {
  Menu,
  List,
  ListItemButton,
  ListItemText,
  IconButton,
  CardActions,
  CardContent,
  Typography,
  Collapse,
  CardHeader,
  Avatar,
  Card,
  Badge,
} from "@mui/material";

import NotificationsIcon from "@mui/icons-material/Notifications";
import CheckIcon from "@mui/icons-material/Check";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function NotificationsButton({ user, userKey, setUserKey }) {
  const [notifications, setNotifications] = useState([]);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const [expanded, setExpanded] = React.useState(false);

  const handleOpenNotifications = (e) => {
    setNotificationsAnchorEl(e.currentTarget);
  };

  const handleCloseNotifications = () => {
    setNotificationsAnchorEl(null);
  };

  useEffect(() => {
    const unreadNotifications = Object.values(user.notifications).filter(
      (notification) => notification.status === "Não Lida"
    );

    setNotifications(unreadNotifications);
  }, [user]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await api.put("/managers/readNotification", {
        userId: user._id,
        notificationId,
      });

      // Atualize o estado local da notificação para "Lida"
      const updatedUser = {
        ...user,
        notifications: {
          ...user.notifications,
          [notificationId]: {
            ...user.notifications[notificationId],
            status: "Lida",
          },
        },
      };

      // Atualize o localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Força a re-renderização, alterando diretamente o estado do usuário
      setNotifications((prevNotifications) =>
        prevNotifications.filter((note) => note.id !== notificationId)
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <>
      <Badge
        color="error"
        size="small"
        badgeContent={notifications.length}
        overlap="circular"
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <IconButton onClick={handleOpenNotifications}>
          <NotificationsIcon />
        </IconButton>
      </Badge>

      <Menu
        anchorEl={notificationsAnchorEl}
        open={Boolean(notificationsAnchorEl)}
        onClose={handleCloseNotifications}
      >
        <List>
          {notifications.length > 0 ? (
            notifications
              .filter((note) => note.status === "Não Lida")
              .map((notification) => (
                <Card
                  key={notification._id}
                  id={notification._id}
                  sx={{ width: 220 }}
                >
                  <CardHeader
                    action={
                      <IconButton
                        onClick={() => setExpanded(!expanded)}
                        aria-expanded={expanded}
                      >
                        {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    }
                    title={
                      <Typography sx={{ fontWeight: "bold", fontSize: 13 }}>
                        {notification.sender}
                      </Typography>
                    }
                    subheader={
                      <Typography sx={{ fontSize: 12, color: "#888" }}>
                        {notification.type}
                        {" - "}
                        {dayjs(notification.createdAt).format("DD/MM/YYYY")}
                      </Typography>
                    }
                  />

                  <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                      <Typography sx={{ fontSize: 13 }}>
                        {notification.noteBody}
                      </Typography>
                    </CardContent>
                    <CardActions disableSpacing>
                      <IconButton
                        sx={{ ml: "auto" }}
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        <CheckIcon />
                      </IconButton>
                    </CardActions>
                  </Collapse>
                </Card>
              ))
          ) : (
            <ListItemButton>
              <ListItemText
                primary={`${notifications.length} Novas Notificações`}
              />
            </ListItemButton>
          )}
        </List>
      </Menu>
    </>
  );
}
