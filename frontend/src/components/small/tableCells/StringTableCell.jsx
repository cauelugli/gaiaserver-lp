/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";

import { InputAdornment, TextField } from "@mui/material";

const StringTableCell = (props) => {
  return (
    <TextField
      type={props.isPassword ? "password" : props.isNumber ? "number" : "text"}
      value={props.fields[props.field.name] || ""}
      onChange={props.handleChange(props.field.name)}
      sx={{
        width: props.isFullWidth
          ? "336%"
          : props.modalOptions.maxWidth === "xs"
          ? 190
          : props.modalOptions.maxWidth === "sm"
          ? 175
          : props.modalOptions.maxWidth === "md"
          ? 200
          : 200,
      }}
      size="small"
      required={props.field.required}
      InputProps={{
        ...(props.isCurrency && {
          startAdornment: <InputAdornment position="start">R$</InputAdornment>,
        }),
        style: {
          fontSize: 13,
          padding: "2px 2px",
        },
      }}
    />
  );
};

export default StringTableCell;
