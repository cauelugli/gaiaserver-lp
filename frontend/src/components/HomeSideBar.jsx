/* eslint-disable no-unused-vars */
import React from "react";

import { Grid, Typography } from "@mui/material";

import UserShortcuts from "./small/UserShortcuts";
import NewsBox from "./small/NewsBox";

const HomeSideBar = () => {
  return (
    <Grid sx={{ mx: 1 }}>
      <UserShortcuts />
      <NewsBox />
    </Grid>
  );
};

export default HomeSideBar;
