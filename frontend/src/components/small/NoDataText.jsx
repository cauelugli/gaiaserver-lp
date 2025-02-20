/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";

import { Grid2, Typography } from "@mui/material";

const NoDataText = () => {
  return (
    <Grid2
      container
      direction="row"
      alignItems="center"
      justifyContent="center"
      sx={{ mt: 3, mb: "30vw" }}
    >
      <Typography sx={{ fontSize: 30 }}>Nenhum Item Encontrado</Typography>
    </Grid2>
  );
};

export default NoDataText;
