/* eslint-disable no-unused-vars */
import React from "react";

import { Grid, Typography } from "@mui/material";

const HomeRecentActivity = () => {
  return (
    <>
      <Grid
        sx={{
          mx: 1,
          height: 120,
          width: "100%",
          backgroundColor: "rgba(44,147,147, 0.9)",
          border: "1px solid #2c9393",
          borderRadius: 2,
        }}
      ></Grid>
      <Typography
        sx={{
          mt: 0.5,
          ml: "90%",
          fontSize: 12,
          color: "grey",
          cursor: "pointer",
        }}
      >
        ver mais
      </Typography>
    </>
  );
};

export default HomeRecentActivity;
