/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import InputMask from "react-input-mask";
import { InputLabel, TextField } from "@mui/material";

const DateTableCell = (props) => {
  return (
    <>
      <InputLabel>{props.field.label}</InputLabel>
      <InputMask
        mask="99/99/9999"
        value={props.fields[props.field.name] || ""}
        onChange={props.handleChange(props.field.name)}
      >
        {(inputProps) => (
          <TextField
            {...inputProps}
            sx={{
              width:
                props.modalOptions.maxWidth === "xxs"
                  ? 100
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
              style: {
                fontSize: 13,
                padding: "2px 2px",
              },
            }}
          />
        )}
      </InputMask>
    </>
  );
};

export default DateTableCell;
