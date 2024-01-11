/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import * as React from "react";

import { Grid } from "@mui/material";

import UserButton from "./small/buttons/UserButton";
import NotificationsButton from "./small/buttons/NotificationsButton";

export default function NavBar({
  user,
  socket,
  configData,
  notifications,
  setNotifications,
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
            ? configData.customization.mainColor
            : "#32aacd",
      }}
    >
      <Grid item>
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
          onClick={() => alert("Esse é o logo da sua empresa!")}
        />
      </Grid>
      <Grid item sx={{mr:2}}>
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
