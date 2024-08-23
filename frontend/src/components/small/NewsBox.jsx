/* eslint-disable no-unused-vars */
import React from "react";

import { Grid, Typography } from "@mui/material";

const NewsBox = () => {
  return (
    <Grid
      sx={{
        height: 250,
        width: "auto",
        backgroundColor: "#cecece",
        border: "1px solid #eee",
        borderRadius: 4
      }}
    >
      <Typography sx={{ m: 2 }}>Avisos e Notícias</Typography>
    </Grid>
  );
};

export default NewsBox;
