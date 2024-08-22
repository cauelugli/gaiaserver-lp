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
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";

import CustomerSelect from "../../components/small/selects/CustomerSelect";
import WorkerSelect from "../../components/small/selects/WorkerSelect";
import GroupSelect from "../../components/small/selects/GroupSelect";

const CalendarEventModal = ({
  userId,
  selectedDate,
  open,
  handleClose,
  title,
  setTitle,
  type,
  types,
  setType,
  setCustomer,
  setService,
  setWorker,
  setGroup,
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
          <Grid sx={{ mb: 3 }}>
            <Select
              value={type}
              sx={{ width: 180, mt: 1 }}
              onChange={(e) => setType(e.target.value)}
              displayEmpty
              renderValue={(selected) => {
                if (!selected) {
                  return <Typography>Tipo de Evento</Typography>;
                }

                return (
                  <Grid
                    container
                    direction="row"
                    alignItems="center"
                    justifyContent="flex-start"
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        mr: 1,
                        width: 15,
                        height: 15,
                        borderRadius: 50,
                        backgroundColor: selected.color,
                      }}
                    />
                    <Typography>{selected.name}</Typography>
                  </Grid>
                );
              }}
            >
              {types &&
                types.map((type) => (
                  <MenuItem key value={type}>
                    <Grid
                      container
                      direction="row"
                      alignItems="center"
                      justifyContent="flex-start"
                    >
                      <Paper
                        elevation={0}
                        sx={{
                          mr: 1.5,
                          width: 15,
                          height: 15,
                          borderRadius: 50,
                          backgroundColor: type.color || "lightgrey",
                        }}
                      />
                      <Typography>{type.name}</Typography>
                    </Grid>
                  </MenuItem>
                ))}
            </Select>
            <CustomerSelect mx075 setCustomer={setCustomer} />
          </Grid>

          <Grid sx={{ mb: 3 }}>
            <WorkerSelect setWorker={setWorker} />
            <GroupSelect setGroup={setGroup} />
          </Grid>
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
