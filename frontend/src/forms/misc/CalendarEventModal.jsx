/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";

const CalendarEventModal = ({
  open,
  handleClose,
  title,
  setTitle,
  type,
  setType,
  handleAddEvent,
}) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        <Typography
          sx={{ fontSize: 16, fontWeight: "bold", textAlign: "center", mb: 2 }}
        >
          Adicionar Evento
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Grid container direction="column">
          <TextField
            label="Título do Evento"
            type="text"
            fullWidth
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ my: 3, width: 400 }}
          />
          <Select
            value={type}
            size="small"
            onChange={(e) => setType(e.target.value)}
          >
            <MenuItem value={"Job"}>Job</MenuItem>
            <MenuItem value={"Tarefa de Projeto"}>Tarefa de Projeto</MenuItem>
          </Select>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          color="error"
          variant="contained"
          startIcon={<DeleteIcon />}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleAddEvent}
          color="success"
          variant="contained"
          startIcon={<CheckIcon />}
        >
          Adicionar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CalendarEventModal;
