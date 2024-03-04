/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import * as React from "react";

import { Button, Grid } from "@mui/material";

import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";

export default function AgendaActions({ onClose, handleResolveEvent, handleDeleteEvent }) {
  return (
    <Grid
      container
      direction="row"
      alignItems="center"
      justifyContent="center"
      sx={{ mb: 4 }}
    >
      <Button
        cursor="pointer"
        variant="contained"
        color="success"
        size="small"
        onClick={handleResolveEvent}
        sx={{ mx: 0.5 }}
        startIcon={<CheckIcon />}
      >
        Concluir
      </Button>
      <Button
        cursor="pointer"
        variant="contained"
        color="error"
        size="small"
        onClick={handleDeleteEvent}
        sx={{ mx: 0.5 }}
        startIcon={<DeleteIcon />}
      >
        Excluir
      </Button>
      <Button
        cursor="pointer"
        variant="outlined"
        color="inherit"
        onClick={onClose}
        sx={{ mx: 0.5 }}
        startIcon={<ClearIcon />}
        size="small"
      >
        Fechar
      </Button>
    </Grid>
  );
}
