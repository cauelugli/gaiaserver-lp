/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import InputMask from "react-input-mask";
import { InputLabel, TextField } from "@mui/material";

const PhoneTableCell = (props) => {
  return (
    <>
      <InputLabel>{props.field.label}</InputLabel>
      <InputMask
        mask={
          props.isCellphone ||
          props.field.name === "cellphone" ||
          props.field.name === "mainContactPhone"
            ? "(99) 99999-9999"
            : "(99) 9999-9999"
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

export default PhoneTableCell;
