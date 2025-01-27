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
  isEditing,
}) => {
  return (
    <DialogTitle
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1,
      }}
    >
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
          id="title"
          textAlign="center"
          sx={{ fontSize: "1.5vw", fontWeight: "bold" }}
        >
          {special
            ? specialTitle
            : femaleGender
            ? `${isEditing ? "Editando" : "Nova"}`
            : `${isEditing ? "Editando" : "Novo"}`}
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
