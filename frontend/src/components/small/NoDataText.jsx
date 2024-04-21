/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";

import { Grid, Typography } from "@mui/material";

const NoDataText = ({ option, femaleGender }) => {
  return (
    <Grid
      container
      direction="row"
      alignItems="center"
      justifyContent="center"
      sx={{ mt: 3, mb:"30vw" }}
    >
      <Typography sx={{ fontSize: 30, color: "#777" }}>
        Não há {option} Cadastrad{femaleGender?"a":"o"}s
      </Typography>
    </Grid>
  );
};

export default NoDataText;
