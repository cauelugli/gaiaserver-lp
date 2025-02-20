/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";

import {
  FormHelperText,
  Grid2,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

import { icons } from "../../icons";

import CustomerSelect from "./selects/CustomerSelect";

const NewUserShortcutOptions = ({
  setOption,
  newShortcutSelectedItem,
  setNewShortcutSelectedItem,
  allowedLinks,
}) => {
  const [selectedOption, setSelectedOption] = useState("");
  const sections = [
    { name: "Clientes", icon: <icons.WorkIcon sx={{ fontSize: 14, mb: 0.5 }} /> },
    {
      name: "Solicitações",
      icon: <icons.GradingIcon sx={{ fontSize: 14, mb: 0.5 }} />,
    },
    {
      name: "Colaboradores",
      icon: <icons.GroupIcon sx={{ fontSize: 14, mb: 0.5 }} />,
    },
    { name: "Departamentos", icon: <icons.LanIcon sx={{ fontSize: 14, mb: 0.5 }} /> },
  ];

  let options = [
    {
      value: {
        label: "Novo Job",
        action: "addJob",
        fullWidth: true,
        maxWidth: "lg",
        permission: "requests",
        section: "Solicitações",
      },
    },
    {
      value: {
        label: "Job para Cliente",
        action: "addJobToCustomer",
        fullWidth: true,
        maxWidth: "lg",
        permission: "requests",
        section: "Solicitações",
      },
    },
    {
      value: {
        label: "Nova Venda",
        action: "addSale",
        fullWidth: true,
        maxWidth: "md",
        permission: "requests",
        section: "Solicitações",
      },
    },
    {
      value: {
        label: "Venda para Cliente",
        action: "addSaleToCustomer",
        fullWidth: true,
        maxWidth: "md",
        permission: "requests",
        section: "Solicitações",
      },
    },
    {
      value: {
        label: "Novo Cliente Pessoa Física",
        action: "addClient",
        fullWidth: true,
        maxWidth: "xs",
        permission: "customers",
        section: "Clientes",
      },
    },
    {
      value: {
        label: "Novo Cliente Empresa",
        action: "addCustomer",
        fullWidth: true,
        maxWidth: "md",
        permission: "customers",
        section: "Clientes",
      },
    },
    {
      value: {
        label: "Novo Usuário",
        action: "addUser",
        fullWidth: true,
        maxWidth: "md",
        permission: "users",
        section: "Colaboradores",
      },
    },
    {
      value: {
        label: "Novo Gerente",
        action: "addManager",
        fullWidth: true,
        maxWidth: "md",
        permission: "users",
        section: "Colaboradores",
      },
    },
    {
      value: {
        label: "Novo Departamento",
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
          selected ? (
            <Typography>{selected.label}</Typography>
          ) : (
            "Selecione uma opção"
          )
        }
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 250, 
              overflow: 'auto',
            },
          },
        }}
      >
        {sections.map((section) => [
          <MenuItem
            key={section.name}
            value=""
            disabled
            sx={{ py: 0, display: "flex", alignItems: "center" }}
          >
            {section.icon}
            <Typography variant="overline" sx={{ ml: 1 }}>
              {section.name}
            </Typography>
          </MenuItem>,
          ...options
            .filter((option) => option.value.section === section.name)
            .map((option, index) => (
              <MenuItem
                key={`${section.name}-${index}`}
                value={option.value}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Typography sx={{ ml: 1 }}>{option.value.label}</Typography>
              </MenuItem>
            )),
        ])}
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
