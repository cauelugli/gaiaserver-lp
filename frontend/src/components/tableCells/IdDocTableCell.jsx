/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import InputMask from "react-input-mask";
import { InputLabel, TextField } from "@mui/material";

const IdDocTableCell = (props) => {
  return (
    <>
      <InputLabel>{props.field.label}</InputLabel>
      <InputMask
        mask={
          props.field.label === "CPF" ? "999.999.999-99" : "99.999.999/9999-99"
        }
        value={props.fields[props.field.name] || ""}
        onChange={props.handleChange(props.field.name)}
      >
        {(inputProps) => (
          <TextField
            {...inputProps}
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

export default IdDocTableCell;
