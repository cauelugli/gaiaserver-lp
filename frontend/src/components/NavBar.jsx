/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import * as React from "react";
import { Link } from "react-router-dom";

import { Grid } from "@mui/material";

import UserButton from "./small/buttons/UserButton";
import NotificationsButton from "./small/buttons/NotificationsButton";

export default function NavBar({
  user,
  socket,
  configData,
  notifications,
  setNotifications,
  darkenedColor,
}) {
  return (
    <Grid
      container
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        backgroundColor:
          configData && configData.customization
            ? darkenedColor
              ? darkenedColor
              : configData.customization.mainColor
            : "#32aacd",
      }}
    >
      <Grid item>
        <Link
          to={"/"}
          style={{
            textDecoration: "none",
            color: "black",
            position: "relative",
            overflow: "hidden",

            backgroundColor:
              configData && configData.customization
                ? darkenedColor
                  ? darkenedColor
                  : configData.customization.mainColor
                : "white",
          }}
        >
          <img
            src={`http://localhost:3000/static/${
              configData && configData.customization
                ? configData.customization.logo
                : ""
            }`}
            alt="Logotipo da Empresa"
            style={{
              width: "20%",
              marginLeft: 30,
              marginTop: 2,
              marginBottom: 2,
              cursor: "pointer",
            }}
          />
        </Link>
      </Grid>
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
  );
}
