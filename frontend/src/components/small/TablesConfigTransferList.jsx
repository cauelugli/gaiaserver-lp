/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import * as React from "react";

import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  Switch,
  Typography,
} from "@mui/material";

const tableTitles = {
  customerCustomer: "Clientes Empresa",
  customerClient: "Clientes Pessoa Física",
  departmentInternal: "Departamentos Internos",
  requestJob: "Pedidos de Job",
  requestSale: "Pedidos de Vendas",
  serviceConsulting: "Serviços de Consultoria",
  servicePlan: "Serviços Planos",
  stockProduct: "Estoque de Produtos",
  stockItems: "Estoque de Materiais",
};

export default function TablesConfigTransferList({
  configData,
  tableStates,
  setTableStates,
}) {
  const handleSwitchChange = (tableName) => {
    setTableStates((prevTableStates) => ({
      ...prevTableStates,
      [tableName]: !prevTableStates[tableName],
    }));
  };

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      {Object.keys(tableStates).map((tableName) => (
        <Grid
          key={tableName}
          container
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ width: 250 }}
        >
          <Typography sx={{ my: "auto" }}>{tableTitles[tableName]}</Typography>
          <Switch
            checked={tableStates[tableName]}
            onChange={() => handleSwitchChange(tableName)}
          />
        </Grid>
      ))}
    </Grid>
  );
}
