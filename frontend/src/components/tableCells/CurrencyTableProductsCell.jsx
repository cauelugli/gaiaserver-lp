/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { InputAdornment, InputLabel, TextField } from "@mui/material";
import { handleCurrencyValueChange } from "../../../../controllers/handlers/handlers";

const CurrencyTableProductsCell = (props) => {
  const handleChange = (e) => {
    handleCurrencyValueChange(e, (formattedValue) => {
      props.onChange(formattedValue);
    });
  };

  return (
    <>
      <InputLabel>{props.field.label}</InputLabel>
      <TextField
        size="small"
        value={props.value || ""}
        onChange={handleChange}
        InputProps={{
          startAdornment: props.hideAdornment ? (
            ""
          ) : (
            <InputAdornment position="start">R$</InputAdornment>
          ),
        }}
        sx={{
          width:
            props.modalOptions.maxWidth === "xs"
              ? 190
              : props.modalOptions.maxWidth === "sm"
              ? 175
              : props.modalOptions.maxWidth === "md"
              ? 200
              : 200,
        }}
        required={props.field.required}
      />
    </>
  );
};

export default CurrencyTableProductsCell;
