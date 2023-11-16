/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";

import { Grid, Typography } from "@mui/material";

const NoDataText = ({ option }) => {
  return (
    <Grid
      container
      direction="row"
      alignItems="center"
      justifyContent="center"
      sx={{ mt: 3 }}
    >
      <Typography sx={{ fontSize: 30, color: "#777" }}>
        Não há {option} Cadastrados
      </Typography>
    </Grid>
  );
};

export default NoDataText;
