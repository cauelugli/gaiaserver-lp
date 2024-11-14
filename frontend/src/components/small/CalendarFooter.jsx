/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";

import { Grid, Typography } from "@mui/material";

const CalendarFooter = () => {
  return (
    <Grid
      sx={{
        height: 150,
        width: "auto",
        backgroundColor: "#f8f8ff",
        border: "1px solid #e7e7ee",
        borderRadius: 3,
        mt: 1,
      }}
    >
      <Typography
        sx={{
          m: 2,
          fontSize: 18,
          fontWeight: "bold",
          color: "#555",
          fontFamily: "Verdana, sans-serif",
        }}
      >
        banana
      </Typography>
    </Grid>
  );
};

export default CalendarFooter;
