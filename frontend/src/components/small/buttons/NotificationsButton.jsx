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
  Card,
  Badge,
  Tooltip,
  Grid,
  Switch,
  FormControlLabel,
} from "@mui/material";

import CheckIcon from "@mui/icons-material/Check";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import NotificationsIcon from "@mui/icons-material/Notifications";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function NotificationsButton({
  user,
  socket,
  notifications,
  setNotifications,
}) {
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const [showOnlyRead, setShowOnlyRead] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [selectedNotificationId, setSelectedNotificationId] =
    React.useState("");

  const handleOpenNotifications = (e) => {
    setNotificationsAnchorEl(e.currentTarget);
  };

  const handleCloseNotifications = () => {
    setNotificationsAnchorEl(null);
  };

  socket.on("connect", () => {
    console.log("Connected to server");
  });

  socket.on("notificationsUpdate", (data) => {
    setNotifications(data.notifications);
  });

  socket.emit("userId", user._id);

  let adjustEndpoint;
  if (user.isManager) {
    adjustEndpoint = "managers";
  } else {
    adjustEndpoint = "users";
  }

  useEffect(() => {
    const handleNotificationsUpdate = (data) => {
      setNotifications(data.notifications);
    };

    return () => {
      socket.off("notificationsUpdate", handleNotificationsUpdate);
    };
  }, [socket, setNotifications]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await api.put(`/${adjustEndpoint}/readNotification`, {
        userId: user._id,
        notificationId,
      });

      fetchNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put(`/${adjustEndpoint}/markAllAsRead`, { userId: user._id });
      fetchNotifications();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await api.get(
        `/${adjustEndpoint}/notifications/${user._id}`
      );
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const filteredNotifications = showOnlyRead
    ? Object.values(notifications)
    : Object.values(notifications).filter((note) => note.status === "Não Lida");

  return (
    <>
      <Badge
        color="error"
        size="small"
        badgeContent={showOnlyRead ? null : filteredNotifications.length}
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
        sx={{ maxHeight: 400 }}
      >
        <List sx={{ mt: -2 }}>
          {filteredNotifications.reverse().map((notification, index) => (
            <Card elevation={0} key={index} sx={{ width: 220, m: 1 }}>
              <CardHeader
                action={
                  <IconButton
                    onClick={() => {
                      setExpanded(!expanded);
                      setSelectedNotificationId(notification.id);
                    }}
                    aria-expanded={expanded}
                  >
                    {expanded && selectedNotificationId === notification.id ? (
                      <ExpandLessIcon />
                    ) : (
                      <ExpandMoreIcon />
                    )}
                  </IconButton>
                }
                title={
                  <Typography sx={{ fontWeight: "bold", fontSize: 13 }}>
                    {notification.sender}{" "}
                    {notification.status === "Lida" && `- Lida`}
                  </Typography>
                }
                subheader={
                  <Typography sx={{ fontSize: 12, color: "#888" }}>
                    {notification.type}
                    {" - "}
                    {notification.createdAt}
                  </Typography>
                }
              />

              <Collapse
                in={expanded && selectedNotificationId === notification.id}
                timeout="auto"
                unmountOnExit
              >
                <CardContent sx={{ mt: -3 }}>
                  <Typography sx={{ fontSize: 13 }}>
                    {notification.noteBody}
                  </Typography>
                </CardContent>
                {notification.status !== "Lida" && (
                  <CardActions disableSpacing>
                    <Tooltip title={"Marcar como Lida"}>
                      <IconButton
                        sx={{ ml: "auto" }}
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        <CheckIcon />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                )}
              </Collapse>
            </Card>
          ))}
          {Object.values(notifications).filter(
            (note) => note.status === "Não Lida"
          ).length === 0 &&
            !showOnlyRead && (
              <Typography sx={{ m: 3 }}>Sem Novas Notificações</Typography>
            )}
        </List>
        <Grid
          sx={{ px: 2 }}
          container
          justifyContent={
            Object.values(notifications).filter(
              (note) => note.status === "Não Lida"
            ).length === 0
              ? "flex-end"
              : "space-between"
          }
        >
          {Object.values(notifications).filter(
            (note) => note.status === "Não Lida"
          ).length !== 0 && (
            <Tooltip title="Marcar Todas como Lidas">
              <IconButton onClick={handleMarkAllAsRead}>
                <DoneAllIcon
                  sx={{
                    "&:hover": {
                      color: "darkgreen",
                    },
                  }}
                />
              </IconButton>
            </Tooltip>
          )}

          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={showOnlyRead}
                onChange={() => setShowOnlyRead(!showOnlyRead)}
              />
            }
            label={<Typography sx={{ fontSize: 10 }}>Mostrar Todas</Typography>}
            labelPlacement="start"
          />
        </Grid>
      </Menu>
    </>
  );
}
