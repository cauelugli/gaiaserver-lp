/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import * as React from "react";

import { Grid2, Switch, Typography } from "@mui/material";

const tableTitles = {
  customerCustomer: "Clientes - Empresa",
  customerClient: "Clientes - Pessoa Física",
  groups: "Grupos",
  requestJob: "Solicitações - Job",
  requestSale: "Solicitações - Vendas",
  servicePlan: "Plano de Serviços",
};

export default function TablesConfigTransferList({
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
    <>
      {Object.keys(tableStates).map((tableName) => (
        <Grid2
          key={tableName}
          container
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ width: "25vw" }}
        >
          <Typography sx={{ my: "auto" }}>{tableTitles[tableName]}</Typography>
          <Switch
            checked={tableStates[tableName]}
            onChange={() => handleSwitchChange(tableName)}
          />
        </Grid2>
      ))}
    </>
  );
}
