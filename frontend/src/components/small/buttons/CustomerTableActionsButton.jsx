/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import * as React from "react";

import { Button, Grid } from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

export default function CustomerTableActionsButton({
  configData,
  customer,
  handleOpenEdit,
  handleConfirmDelete,
  tableType,
}) {
  return (
    <Grid container direction="row">
      <Button
        cursor="pointer"
        variant="outlined"
        color="inherit"
        onClick={() => handleOpenEdit(customer, "edit")}
        sx={{ mx: 1 }}
        startIcon={<ModeEditIcon />}
      >
        Editar
      </Button>
      {tableType === "Customer" && configData.customersCanBeDeleted && (
        <Button
          cursor="pointer"
          color="error"
          variant="contained"
          onClick={() => handleConfirmDelete(customer)}
          startIcon={<DeleteIcon />}
        >
          Deletar
        </Button>
      )}
      {tableType === "Client" && configData.clientsCanBeDeleted && (
        <Button
          cursor="pointer"
          color="error"
          variant="contained"
          onClick={() => handleConfirmDelete(customer)}
          startIcon={<DeleteIcon />}
        >
          Deletar
        </Button>
      )}
    </Grid>
  );
}
