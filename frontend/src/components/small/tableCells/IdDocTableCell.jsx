/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import InputMask from "react-input-mask";
import { TextField } from "@mui/material";

const IdDocTableCell = (props) => {
  console.log("props.field.label", props.field.label);

  return (
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
        />
      )}
    </InputMask>
  );
};

export default IdDocTableCell;
