/* eslint-disable react/prop-types */
import * as React from "react";
import { Link } from "react-router-dom";

import { Grid2, Tooltip, Typography } from "@mui/material";

import { icons } from "../../icons";

import UserButton from "../small/buttons/UserButton";
import NotificationsButton from "../small/buttons/NotificationsButton";
import TopBar from "../large/TopBar";

export default function NavBar({ user, api, socket, configData, barPosition }) {
  const [notifications, setNotifications] = React.useState([]);
  const [missingCoreData, setMissingCoreData] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      let notifications;
      let missingCoreData = [];
      try {
        user.username === "admin"
          ? (notifications = await api.get("/admin/notifications/"))
          : (notifications = await api.get(`/get/notifications/${user._id}`));
        setNotifications(notifications.data);
        user.username === "admin"
          ? (missingCoreData = await api.get("/get/coreData"))
          : "";
        setMissingCoreData(missingCoreData.data || "");
      } catch (error) {
        if (error.response?.status !== 404) {
          console.error("Error fetching data:", error);
        } else {
          console.log(error);
        }
      }
    };
    fetchData();
  }, [api, user]);

  const fetchData = async () => {
    let notifications;
    try {
      user.username === "admin"
        ? (notifications = await api.get("/admin/notifications/"))
        : (notifications = await api.get(`/get/notifications/${user._id}`));
      setNotifications(notifications.data);
    } catch (error) {
      if (error.response.status !== 404) {
        console.error("Error fetching data:", error);
      }
    }
  };

  React.useEffect(() => {
    const handleNewNotificationToAdmin = (notificationData) => {
      // only to admin user
      if (notificationData && user.username === "admin") {
        fetchData();
      }
    };

    socket.on("newNotificationToAdmin", handleNewNotificationToAdmin);

    return () => {
      socket.on("newNotificationToAdmin", handleNewNotificationToAdmin);
    };
  });

  return (
    <>
      {configData && configData.customization && (
        <Grid2
          container
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            backgroundColor: configData.customization.mainColor,
            width: "100%",
          }}
        >
          <Grid2
            item
            sx={{
              ml: 1,
              maxWidth: "10%",
              height: "auto",
              cursor: "pointer",
            }}
          >
            <Link to={"/"}>
              <img
                src={`http://localhost:8080/static/${
                  configData && configData.customization
                    ? configData.customization.logo
                    : ""
                }`}
                alt="logo"
                style={{
                  width: "100%",
                }}
              />
            </Link>
          </Grid2>
          {missingCoreData.length !== 0 && (
            <Grid2 sx={{ ml: 1, mr: "auto" }}>
              <Tooltip
                title={
                  <React.Fragment>
                    {missingCoreData.map((item, index) => (
                      <Typography
                        key={index}
                        sx={{ fontSize: 15, m: 1, color: "white" }}
                      >
                        Não há nenhum {item}
                      </Typography>
                    ))}
                  </React.Fragment>
                }
              >
                <icons.ReportProblemIcon
                  sx={{
                    height: "2vw",
                    width: "2vw",
                    animation: "fadeOpacity 2s infinite",
                    "@keyframes fadeOpacity": {
                      "0%": { opacity: 1 },
                      "14%": { opacity: 0.9 },
                      "28%": { opacity: 0.8 },
                      "42%": { opacity: 0.7 },
                      "57%": { opacity: 0.6 },
                      "71%": { opacity: 0.5 },
                      "85%": { opacity: 0.4 },
                      "100%": { opacity: 0.3 },
                    },
                  }}
                />
              </Tooltip>
            </Grid2>
          )}
          {barPosition && (
            <Grid2
              container
              direction="row"
              alignItems="center"
              justifyContent="space-evenly"
              sx={{
                width: "auto",
                mr: missingCoreData.length === 0 ? "" : "auto",
              }}
            >
              <TopBar configData={configData} user={user} />
            </Grid2>
          )}

          <Grid2 item sx={{ mr: 2 }}>
            <Grid2 container direction="row">
              <NotificationsButton
                api={api}
                socket={socket}
                user={user}
                mainColor={configData.customization.mainColor}
                notifications={notifications}
                setNotifications={setNotifications}
                fetchData={fetchData}
                sx={{ mr: 3, color: "#333" }}
              />
              <UserButton user={user} />
            </Grid2>
          </Grid2>
        </Grid2>
      )}
    </>
  );
}
