/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import * as React from "react";
import { Link } from "react-router-dom";

import { Grid, Typography } from "@mui/material";

import UserButton from "../small/buttons/UserButton";
import NotificationsButton from "../small/buttons/NotificationsButton";
import TopBar from "../large/TopBar";

export default function NavBar({
  user,
  socket,
  configData,
  notifications,
  setNotifications,
  barPosition,
}) {
  return (
    <>
      {configData && configData.customization && (
        <Grid
          container
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ backgroundColor: configData.customization.mainColor }}
        >
          <Grid
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
                src={`http://localhost:3000/static/${
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
          </Grid>

          {barPosition && (
            <Grid
              container
              direction="row"
              alignItems="center"
              justifyContent="space-evenly"
              sx={{ width: "auto" }}
            >
              <TopBar configData={configData} user={user} />
            </Grid>
          )}

          <Grid item sx={{ mr: 2 }}>
            <Grid container direction="row">
              <NotificationsButton
                socket={socket}
                user={user}
                notifications={notifications}
                setNotifications={setNotifications}
                sx={{ mr: 3, color: "#333" }}
              />
              <UserButton user={user} />
            </Grid>
          </Grid>
        </Grid>
      )}
    </>
  );
}
