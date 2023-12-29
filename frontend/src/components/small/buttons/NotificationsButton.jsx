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
} from "@mui/material";

import NotificationsIcon from "@mui/icons-material/Notifications";
import CheckIcon from "@mui/icons-material/Check";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function NotificationsButton({ user, notificationsChange }) {
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
    const fetchData = async () => {
      try {
        const response = await api.get(`/notifications/${user._id}`);
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchData();
  }, [user._id, notificationsChange]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await api.put("/notifications", { notification: notificationId });
      const updatedNotifications = notifications.map((notification) =>
        notification._id === notificationId
          ? { ...notification, status: "Lida" }
          : notification
      );
      setNotifications(updatedNotifications);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <>
      <IconButton onClick={handleOpenNotifications}>
        <NotificationsIcon />
      </IconButton>

      <Menu
        anchorEl={notificationsAnchorEl}
        open={Boolean(notificationsAnchorEl)}
        onClose={handleCloseNotifications}
      >
        <List>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <Card
                key={notification._id}
                id={notification._id}
                sx={{ width: 220 }}
              >
                <CardHeader
                  avatar={
                    <Avatar
                      src={`http://localhost:3000/static${notification.sender.image}`}
                    />
                  }
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
                      {notification.sender.name}
                    </Typography>
                  }
                  subheader={
                    <Typography sx={{ fontSize: 11, color: "#777" }}>
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
                      onClick={() => handleMarkAsRead(notification._id)}
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
