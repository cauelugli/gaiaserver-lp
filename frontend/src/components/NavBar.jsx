/* eslint-disable no-unused-vars */
import * as React from "react";

import { Grid, IconButton } from "@mui/material";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function NavBar() {
  return (
    <Grid
      container
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ backgroundColor: "#32aacd", width:"100%" }}
    >
      <img
        src={`http://localhost:3000/static/logo.png`}
        alt="Logo do Tenant"
        style={{ width: "10%", marginLeft: 10, cursor: "pointer" }}
        onClick={() => alert("logo man")}
      />
      <IconButton sx={{ color: "white" }}>
        <AccountCircleIcon />
      </IconButton>
    </Grid>
  );
}
