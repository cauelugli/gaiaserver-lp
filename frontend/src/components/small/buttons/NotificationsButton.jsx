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
} from "@mui/material";

import NotificationsIcon from "@mui/icons-material/Notifications";
import CheckIcon from "@mui/icons-material/Check";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

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
  const [expanded, setExpanded] = React.useState(false);

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

  if (!user.position.name) {
    adjustEndpoint = "managers";
  } else {
    if (user.position && user.position.name.startsWith("Gerente")) {
      adjustEndpoint = "managers";
    } else {
      adjustEndpoint = "users";
    }
  }

  useEffect(() => {
    const handleNotificationsUpdate = (data) => {
      setNotifications(data.notifications);
    };

    // Remova o ouvinte quando o componente for desmontado
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

  const fetchNotifications = async () => {
    try {
      const response = await api.get(`/managers/notifications/${user._id}`);
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  return (
    <>
      <Badge
        color="error"
        size="small"
        badgeContent={
          Object.values(notifications).filter(
            (note) => note.status === "Não Lida"
          ).length
        }
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
          {Object.values(notifications)
            .filter((note) => note.status === "Não Lida")
            .map((notification) => (
              <Card
                key={notification._id}
                id={notification._id}
                sx={{ width: 220 }}
              >
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
                      <Tooltip title={"Marcar como Lida"}>
                        <IconButton
                          sx={{ ml: "auto" }}
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <CheckIcon />
                        </IconButton>
                      </Tooltip>
                    </CardActions>
                  </Collapse>
                </Card>
              </Card>
            ))}
          {Object.values(notifications).filter(
            (note) => note.status === "Não Lida"
          ).length === 0 && (
            <ListItemButton>
              <ListItemText primary={"Sem Novas Notificações"} />
            </ListItemButton>
          )}
        </List>
      </Menu>
    </>
  );
}
