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

import CustomerSelect from "../../components/small/selects/CustomerSelect";
import ServiceSelect from "../../components/small/selects/ServiceSelect";

const CalendarEventModal = ({
  selectedDate,
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
          sx={{ fontSize: 16, fontWeight: "bold", textAlign: "center" }}
        >
          Novo Evento
        </Typography>
        <Typography
          sx={{ fontSize: 14, textAlign: "center", mb: 1, color: "#555" }}
        >
          {selectedDate}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Grid container direction="row">
          <TextField
            label="Título do Evento"
            type="text"
            fullWidth
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ my: 3 }}
          />
          <Select
            value={type}
            sx={{ width: 180, mt: 1 }}
            onChange={(e) => setType(e.target.value)}
            displayEmpty
            renderValue={(selected) => {
              if (!selected) {
                return <Typography>Tipo de Evento</Typography>;
              }

              return selected;
            }}
          >
            <MenuItem value={"Job"}>Job</MenuItem>
            <MenuItem value={"Tarefa de Projeto"}>Tarefa de Projeto</MenuItem>
          </Select>
          <CustomerSelect mx075 />
          <ServiceSelect />
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
