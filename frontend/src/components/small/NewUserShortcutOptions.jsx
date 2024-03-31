/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";

import { FormHelperText, MenuItem, Select, Typography } from "@mui/material";
import CustomerSelect from "./selects/CustomerSelect";

const NewUserShortcutOptions = ({
  setOption,
  newShortcutSelectedItem,
  setNewShortcutSelectedItem,
  allowedLinks,
}) => {
  const [selectedOption, setSelectedOption] = useState("");
  let options = [
    {
      value: {
        label: "Adicionar Job",
        action: "addJob",
        fullWidth: true,
        maxWidth: "lg",
        permission: "requests",
        section: "Solicitações",
      },
    },
    {
      value: {
        label: "Adicionar Job para Cliente",
        action: "addJobToCustomer",
        fullWidth: true,
        maxWidth: "lg",
        permission: "requests",
        section: "Solicitações",
      },
    },
    {
      value: {
        label: "Adicionar Venda",
        action: "addSale",
        fullWidth: true,
        maxWidth: "md",
        permission: "requests",
        section: "Solicitações",
      },
    },
    {
      value: {
        label: "Adicionar Venda para Cliente",
        action: "addSaleToCustomer",
        fullWidth: true,
        maxWidth: "md",
        permission: "requests",
        section: "Solicitações",
      },
    },
    {
      value: {
        label: "Adicionar Cliente Pessoa Física",
        action: "addClient",
        fullWidth: true,
        maxWidth: "xs",
        permission: "customers",
        section: "Clientes",
      },
    },
    {
      value: {
        label: "Adicionar Cliente Empresa",
        action: "addCustomer",
        fullWidth: true,
        maxWidth: "md",
        permission: "customers",
        section: "Clientes",
      },
    },
    {
      value: {
        label: "Adicionar Usuário",
        action: "addUser",
        fullWidth: true,
        maxWidth: "md",
        permission: "users",
        section: "Colaboradores",
      },
    },
    {
      value: {
        label: "Adicionar Gerente",
        action: "addManager",
        fullWidth: true,
        maxWidth: "md",
        permission: "users",
        section: "Colaboradores",
      },
    },
    {
      value: {
        label: "Adicionar Departamento",
        action: "addDepartment",
        fullWidth: true,
        maxWidth: "md",
        permission: "departments",
        section: "Departamentos",
      },
    },
  ];

  options = options.filter((option) =>
    allowedLinks.includes(option.value.permission)
  );

  const handleSelectChange = (event) => {
    const value = event.target.value;
    setSelectedOption(value);

    if (
      value.action === "addSaleToCustomer" ||
      value.action === "addJobToCustomer"
    ) {
      setNewShortcutSelectedItem("");
    } else {
      setNewShortcutSelectedItem(null);
    }

    setOption(value);
  };

  return (
    <>
      <FormHelperText>Selecione a Ação</FormHelperText>
      <Select
        size="small"
        value={selectedOption}
        onChange={handleSelectChange}
        sx={{ width: "100%" }}
        displayEmpty
        renderValue={(selected) =>
          <Typography sx={{ fontSize: 13 }}>{selected.label} </Typography> ||
          "Selecione uma opção"
        }
      >
        {options.map((option, index) => (
          <MenuItem key={index} value={option.value}>
            <Typography sx={{ fontSize: 13 }}>{option.value.label}</Typography>
          </MenuItem>
        ))}
      </Select>
      {(selectedOption.action === "addSaleToCustomer" ||
        selectedOption.action === "addJobToCustomer") && (
        <CustomerSelect
          sx={{ width: "100%" }}
          setCustomer={setNewShortcutSelectedItem}
          selectedCustomer={newShortcutSelectedItem}
          addFromShortcut
        />
      )}
    </>
  );
};

export default NewUserShortcutOptions;
