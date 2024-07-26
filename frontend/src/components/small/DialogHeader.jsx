/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";

import { DialogTitle, Divider, Grid, Typography } from "@mui/material";

const DialogHeader = ({
  title,
  femaleGender,
  plural,
  special,
  specialTitle,
  extraSmall,
}) => {
  return (
    <DialogTitle sx={{ mb: -1 }}>
      <Grid container direction="row" justifyContent="center">
        <Divider
          sx={{
            border: "1px nothing #444",
            width: "10%",
            my: "auto",
            mr: 1.5,
          }}
        />
        <Typography
          textAlign="center"
          sx={{ fontSize: 20, fontWeight: "bold" }}
        >
          {special ? specialTitle : femaleGender ? "Nova" : "Novo"}
          {plural && "s"} {title}
        </Typography>
        <Divider
          sx={{
            border: "1px nothing #444",
            width: extraSmall ? "10%" : "35%",
            my: "auto",
            ml: 1.5,
          }}
        />
      </Grid>
    </DialogTitle>
  );
};

export default DialogHeader;
