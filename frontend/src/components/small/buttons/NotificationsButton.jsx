/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import dayjs from "dayjs";

import {
  Menu,
  List,
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

import { icons } from "../../../icons";

export default function NotificationsButton({
  user,
  socket,
  mainColor,
  notifications,
  setNotifications,
  api,
  fetchData,
}) {
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const [showOnlyRead, setShowOnlyRead] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [selectedNotificationCreatedAt, setSelectedNotificationCreatedAt] =
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

  useEffect(() => {
    const handleNotificationsUpdate = (data) => {
      setNotifications(data.notifications);
    };

    return () => {
      socket.off("notificationsUpdate", handleNotificationsUpdate);
    };
  }, [socket, setNotifications]);

  const handleMarkAsRead = async (notificationCreatedAt) => {
    try {
      const res = await api.put(`/actions/markNotificationAsRead/`, {
        userId: user._id,
        isAdmin: user.username === "admin",
        notificationCreatedAt: notificationCreatedAt,
      });

      if (res.data) {
        fetchData();
        if (user._id) {
          socket.emit("newDataRefreshButton", {
            // this is wrong, fix later
            page: "props.page",
            userId: user._id,
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteNotification = async (notificationCreatedAt) => {
    try {
      const res = await api.put(`/actions/deleteNotification/`, {
        userId: user._id,
        isAdmin: user.username === "admin",
        notificationCreatedAt: notificationCreatedAt,
      });

      if (res.data) {
        fetchData();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const res = await api.put(`/actions/markAllAsRead/`, {
        userId: user._id,
        isAdmin: user.username === "admin",
      });

      if (res.data) {
        fetchData();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const filteredNotifications = !showOnlyRead
    ? Object.values(notifications).filter((note) => note.read === false)
    : Object.values(notifications);

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
          <icons.NotificationsIcon />
        </IconButton>
      </Badge>

      <Menu
        anchorEl={notificationsAnchorEl}
        open={Boolean(notificationsAnchorEl)}
        onClose={handleCloseNotifications}
        sx={{ height: 330 }}
      >
        <Grid sx={{ width: "17vw", mt: -2 }}>
          <List>
            {filteredNotifications.reverse().map((notification, index) => (
              <Card
                elevation={0}
                key={index}
                sx={{
                  cursor: "pointer",
                  m: 1,
                  backgroundColor:
                    notification.read === true
                      ? `${mainColor}80`
                      : `${mainColor}B3`,
                }}
                onClick={() => {
                  setExpanded(!expanded);
                  setSelectedNotificationCreatedAt(notification.createdAt);
                }}
              >
                <CardHeader
                  title={
                    <Typography sx={{ fontWeight: "bold", fontSize: 13 }}>
                      {notification.title}
                      {notification.read === true && (
                        <icons.DoneAllIcon
                          sx={{ ml: 0.5, fontSize: 11, color: "blue" }}
                        />
                      )}
                    </Typography>
                  }
                  subheader={
                    <Typography sx={{ fontSize: 11, ml: "65%" }}>
                      {expanded
                        ? ""
                        : dayjs(notification.createdAt).format(
                            "DD/MM/YYYY HH:mm"
                          )}
                    </Typography>
                  }
                />

                <Collapse
                  in={
                    expanded &&
                    selectedNotificationCreatedAt === notification.createdAt
                  }
                  timeout="auto"
                  unmountOnExit
                >
                  <CardContent sx={{ mt: -2 }}>
                    <Typography sx={{ fontSize: 13 }}>
                      {notification.body}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    {expanded ? (
                      <Typography sx={{ fontSize: 11 }}>
                        {dayjs(notification.createdAt).format(
                          "DD/MM/YYYY HH:mm"
                        )}
                      </Typography>
                    ) : (
                      ""
                    )}
                    {notification.read === true ? (
                      <IconButton
                        sx={{ ml: "auto" }}
                        onClick={() =>
                          handleDeleteNotification(notification.createdAt)
                        }
                      >
                        <icons.DeleteIcon />
                      </IconButton>
                    ) : (
                      <Tooltip title={"Marcar como Lida"}>
                        <IconButton
                          sx={{ ml: "auto" }}
                          onClick={() =>
                            handleMarkAsRead(notification.createdAt)
                          }
                        >
                          <icons.CheckIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </CardActions>
                </Collapse>
              </Card>
            ))}
          </List>
          <Grid
            container
            direction="row"
            alignItems="center"
            justifyContent="center"
            sx={{ mb: 5 }}
          >
            {Object.values(notifications).filter((note) => !note.read)
              .length === 0 && (
              <Typography alignSelf="center" sx={{ fontSize: 14, my: 4 }}>
                {showOnlyRead
                  ? "Nenhuma Notificação Encontrada"
                  : " Sem Novas Notificações"}
              </Typography>
            )}
          </Grid>

          <Grid
            sx={{ px: 2, mt: -5 }}
            container
            justifyContent={
              Object.values(notifications).filter((note) => !note.read)
                .length === 0
                ? "flex-end"
                : "space-between"
            }
          >
            {Object.values(notifications).filter((note) => !note.read)
              .length !== 0 && (
              <Tooltip title="Marcar Todas como Lidas">
                <IconButton onClick={handleMarkAllAsRead}>
                  <icons.DoneAllIcon
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
              label={
                <Typography sx={{ fontSize: 10 }}>Mostrar Lidas</Typography>
              }
              labelPlacement="start"
            />
          </Grid>
        </Grid>
      </Menu>
    </>
  );
}
