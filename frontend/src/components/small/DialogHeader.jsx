/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { DialogTitle, Divider, Grid, Typography } from "@mui/material";
import React from "react";

const DialogHeader = ({
  title,
  femaleGender,
  plural,
  special,
  specialTitle,
  extraSmall,
}) => {
  return (
    <DialogTitle sx={{ mt: 1, mb: 2.5 }}>
      <Grid container direction="row" justifyContent="center">
        <Divider
          sx={{
            border: "1px nothing #444",
            width: extraSmall ? "10%" : "35%",
            my: "auto",
            mr: 1.5,
          }}
        />
        <Typography
          textAlign="center"
          sx={{ fontSize: 18, fontWeight: "bold", color: "#444" }}
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
