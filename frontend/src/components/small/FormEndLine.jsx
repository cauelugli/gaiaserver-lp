/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { Avatar, Divider, Grid } from "@mui/material";

const FormEndLine = ({ config, image }) => {
  return (
    <Grid container direction="row" justifyContent="center">
      <Divider sx={{ border: "1px nothing #444", width: "35%", my: "auto" }} />
      {image && (
        <Avatar
          alt="Imagem do Cliente"
          src={`http://localhost:3000/static/${image}`}
          sx={{
            width: 250,
            height: 70,
            transform: "scale(0.6)",
          }}
        />
      )}
      <Divider sx={{ border: "1px nothing #444", width: "35%", my: "auto" }} />
    </Grid>
  );
};

export default FormEndLine;
