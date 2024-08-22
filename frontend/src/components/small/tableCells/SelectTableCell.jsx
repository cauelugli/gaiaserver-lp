/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";

import { MenuItem, Select, Typography } from "@mui/material";

const SelectTableCell = (props) => {
  return (
    <Select
      value={props.fields[props.field.name] || ""}
      onChange={props.handleChange(props.field.name)}
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
      multiple={props.multiple}
      renderValue={(selected) =>
        selected ? (
          <Typography sx={{ fontSize: 13, mt: 0.5 }}>
            {selected.name || selected}
          </Typography>
        ) : (
          "Selecione"
        )
      }
    >
      {props.menuOptions.map((option, index) => (
        <MenuItem value={option} key={index}>
          {option}
        </MenuItem>
      ))}
    </Select>
  );
};

export default SelectTableCell;
