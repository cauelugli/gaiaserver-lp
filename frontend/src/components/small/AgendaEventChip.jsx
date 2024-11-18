/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";

import { Grid, Typography } from "@mui/material";

const AgendaEventChip = (props) => {
  return (
    <Grid
      container
      direction="row"
      alignItems="center"
      justifyContent="flex-start"
      sx={{
        width: "80%",
        border: "1px solid #c5c5cc",
        borderRadius: 3,
        p: 1,
        mx: "auto",
        mt: 1,
      }}
      gap={4}
    >
      <Typography sx={{ fontSize: 11, color:"black" }}>{"o"}</Typography>
      <Typography sx={{ fontSize: 11, color:"black" }}>{props.item.service}</Typography>
      <Typography sx={{ fontSize: 11, color:"black" }}>{props.item.scheduleTime}</Typography>
      <Typography sx={{ fontSize: 11, color:"black" }}>{"+"}</Typography>
    </Grid>
  );
};

export default AgendaEventChip;
