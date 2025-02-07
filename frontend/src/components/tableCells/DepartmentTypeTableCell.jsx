/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { InputLabel, MenuItem, Select, Typography, Box } from "@mui/material";
import { icons } from "../../icons";

const DepartmentTypeTableCell = (props) => {
  // Opções para o Select
  const options = [
    { name: "Vendas", icon: <icons.SellIcon /> },
    { name: "Serviços", icon: <icons.BuildIcon /> },
    { name: "Interno", icon: <icons.LanIcon /> },
  ];

  return (
    <>
      <InputLabel>{props.field.label}</InputLabel>
      <Select
        value={props.fields[props.field.name] || ""}
        onChange={props.handleChange(props.field.name)}
        sx={{ width: 200 }}
        size="small"
        required
        multiple={props.multiple}
        renderValue={(selected) => {
          const selectedOption = options.find((opt) => opt.name === selected);
          return selectedOption ? (
            <Box display="flex" alignItems="center">
              {selectedOption.icon}
              <Typography sx={{ ml: 1 }}>{selectedOption.name}</Typography>{" "}
              
            </Box>
          ) : (
            ""
          );
        }}
      >
        {options.map((option, index) => (
          <MenuItem value={option.name} key={index}>
            <Box display="flex" alignItems="center">
              {option.icon}
              <Typography sx={{ ml: 1 }}>{option.name}</Typography>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </>
  );
};

export default DepartmentTypeTableCell;
