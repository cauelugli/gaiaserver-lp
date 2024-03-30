/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";

import { FormHelperText, MenuItem, Select, Typography } from "@mui/material";

const NewUserShortcutOptions = ({ setOption }) => {
  const options = [
    {
      value: {
        label: "Adicionar Job",
        action: "addJob",
        fullWidth: true,
        maxWidth: "lg",
      },
    },
    {
      value: {
        label: "Adicionar Venda",
        action: "addSale",
        fullWidth: true,
        maxWidth: "md",
      },
    },
    {
      value: {
        label: "Adicionar Cliente Pessoa Física",
        action: "addClient",
        fullWidth: true,
        maxWidth: "xs",
      },
    },
    {
      value: {
        label: "Adicionar Cliente Empresa",
        action: "addCustomer",
        fullWidth: true,
        maxWidth: "md",
      },
    },
  ];

  return (
    <>
      <FormHelperText>Selecione a Ação</FormHelperText>
      <Select
        size="small"
        onChange={(e) => setOption(e.target.value)}
        sx={{ width: "100%" }}
        renderValue={(selected) => {
          if (!selected) {
            return "";
          } else {
            return (
              <Typography sx={{ fontSize: 14, ml: -1, my: "auto" }}>
                {selected.label}{" "}
              </Typography>
            );
          }
        }}
      >
        {options.map((option, index) => (
          <MenuItem key={index} value={option.value}>
            <Typography sx={{ fontSize: 14, ml: -1, my: "auto" }}>
              {option.value.label}
            </Typography>
          </MenuItem>
        ))}
      </Select>
    </>
  );
};

export default NewUserShortcutOptions;
