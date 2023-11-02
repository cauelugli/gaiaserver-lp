/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import * as React from "react";

import { Grid } from "@mui/material";

import UserButton from "./small/buttons/UserButton";

export default function NavBar({ user }) {
  return (
    <Grid
      container
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ backgroundColor: "#32aacd" }}
    >
      <img
        src={`http://localhost:3000/static/logo_text.png`}
        alt="Logo do Tenant"
        style={{
          width: "8%",
          marginLeft: 30,
          marginTop: 2,
          marginBottom: 2,
          cursor: "pointer",
        }}
        onClick={() => alert("Esse é o logo da sua empresa!")}
      />
      <UserButton user={user} />
    </Grid>
  );
}
