/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import * as React from "react";

import { Grid } from "@mui/material";

import UserButton from "./small/buttons/UserButton";
import NotificationsButton from "./small/buttons/NotificationsButton";

export default function NavBar({ user, configData, userKey, setUserKey }) {
  return (
    <Grid
      container
      direction="row"
      alignItems="center"
      justifyContent="flex-start"
      sx={{
        backgroundColor:
          configData && configData.customization
            ? configData.customization.mainColor
            : "#32aacd",
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
          width: "8%",
          marginLeft: 30,
          marginRight: "83%",
          marginTop: 2,
          marginBottom: 2,
          cursor: "pointer",
        }}
        onClick={() => alert("Esse é o logo da sua empresa!")}
      />
      <NotificationsButton
        user={user}
        userKey={userKey}
        setUserKey={setUserKey}
        sx={{ mr: 2, color: "#333" }}
      />
      <UserButton user={user} />
    </Grid>
  );
}
