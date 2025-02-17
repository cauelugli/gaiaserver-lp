/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";

import { Grid, Typography } from "@mui/material";

const NoDataText = () => {
  return (
    <Grid
      container
      direction="row"
      alignItems="center"
      justifyContent="center"
      sx={{ mt: 3, mb: "30vw" }}
    >
      <Typography sx={{ fontSize: 30 }}>Nenhum Item Encontrado</Typography>
    </Grid>
  );
};

export default NoDataText;
