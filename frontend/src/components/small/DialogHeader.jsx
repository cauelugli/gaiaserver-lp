/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { DialogTitle, Divider, Grid, Typography } from "@mui/material";
import React from "react";

const DialogHeader = ({ title, femaleGender }) => {
  return (
    <DialogTitle sx={{ mt: 1, mb: 2.5 }}>
      <Grid container direction="row" justifyContent="center">
        <Divider sx={{ border:"1px solid #444", width: "40%", my: "auto", mr: 1.5 }} />
        <Typography
          textAlign="center"
          sx={{ fontSize: 18, fontWeight: "bold", color:"#444" }}
        >
          {femaleGender ? "Nova" : "Novo"} {title}
        </Typography>
        <Divider sx={{ border:"1px solid #444", width: "40%", my: "auto", ml: 1.5 }} />
      </Grid>
    </DialogTitle>
  );
};

export default DialogHeader;
