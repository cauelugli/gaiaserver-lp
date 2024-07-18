/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";

import { InputAdornment, TextField } from "@mui/material";

import { handleCurrencyValueChange } from "../../../../../controllers/handlers/handlers"

const CurrencyTableCell = (props) => {
  const handleChange = (e) => {
    handleCurrencyValueChange(e, (formattedValue) =>
      props.setFields({
        ...props.fields,
        [props.field.name]: formattedValue,
      })
    );
  };

  return (
    <TextField
      size="small"
      value={props.fields[props.field.name] || ""}
      onChange={handleChange}
      InputProps={{
        startAdornment: <InputAdornment position="start">R$</InputAdornment>,
      }}
      sx={{
        width: props.modalOptions.maxWidth === "xs"
          ? 190
          : props.modalOptions.maxWidth === "sm"
          ? 175
          : props.modalOptions.maxWidth === "md"
          ? 200
          : 200,
      }}
      required={props.field.required}
    />
  );
};

export default CurrencyTableCell;
