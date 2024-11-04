/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import * as React from "react";

import { Button, Grid } from "@mui/material";

import { icons } from "../../../icons";

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
        startIcon={<icons.CheckIcon />}
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
        startIcon={<icons.DeleteIcon />}
      >
        Excluir
      </Button>
      <Button
        cursor="pointer"
        variant="outlined"
        color="inherit"
        onClick={onClose}
        sx={{ mx: 0.5 }}
        startIcon={<icons.ClearIcon />}
        size="small"
      >
        Fechar
      </Button>
    </Grid>
  );
}
