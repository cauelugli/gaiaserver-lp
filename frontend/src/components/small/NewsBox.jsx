/* eslint-disable no-unused-vars */
import React from "react";

import { Grid, Typography } from "@mui/material";

const NewsBox = () => {
  return (
    <Grid
      sx={{
        height: 250,
        width: "auto",
        backgroundColor: "rgba(44,147,147, 0.9)",
        border: "1px solid #2c9393",
        borderRadius:2
      }}
    >
      <Typography sx={{ m: 2 }}>Notícias e Publicações</Typography>
    </Grid>
  );
};

export default NewsBox;
