/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { Avatar, Divider, Grid2 } from "@mui/material";

const FormEndLineTenant = ({ configCustomization, extraSmall }) => {
  return (
    <Grid2 container direction="row" justifyContent="center">
      <Divider
        sx={{
          border: "1px nothing #444",
          width: extraSmall ? "10%" : "35%",
          my: "auto",
        }}
      />
      {configCustomization.logoBlack !== "" && (
        <Avatar
          alt="Imagem do Cliente"
          src={`http://localhost:3000/static/${configCustomization.logoBlack}`}
          sx={{
            width: 250,
            height: 70,
            transform: "scale(0.5)",
            borderRadius: 1,
            mx: -6,
          }}
        />
      )}
      <Divider
        sx={{
          border: "1px nothing #444",
          width: extraSmall ? "10%" : "35%",
          my: "auto",
        }}
      />
    </Grid2>
  );
};

export default FormEndLineTenant;
