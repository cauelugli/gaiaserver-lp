/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid2,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";

const socket = io("http://localhost:5002");
const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const ResolveForm = ({
  userId,
  selectedItemId,
  selectedItemName,
  selectedItemPrice,
  model,
  refreshData,
  setRefreshData,
  openDialog,
  setOpenDialog,
  page,
  label,
}) => {
  const [resolution, setResolution] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const handleResolve = async () => {
    try {
      const res = await api.put(`/actions/resolve/`, {
        model,
        resolution,
        id: selectedItemId,
        resolvedBy: userId,
      });

      if (res.data) {
        toast.success(`${selectedItemName} Resolvido!`, {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });

        if (userId) {
          socket.emit("newDataRefreshButton", { page, userId });
        }
      }
      setOpenDialog(false);
      setRefreshData(!refreshData);
      api.post("/log", {
        source: userId,
        target: res.data,
        label: label,
        type: "resolve",
      });
    } catch (err) {
      toast.error("Houve um erro...", {
        closeOnClick: true,
        pauseOnHover: false,
        theme: "colored",
        autoClose: 1200,
      });
      console.log(err);
    }
  };

  const handlePrimaryResolve = () => {
    if (model === "StockEntry") {
      setConfirmDialogOpen(true);
    } else {
      handleResolve();
    }
  };

  const handleConfirm = () => {
    setConfirmDialogOpen(false);
    handleResolve();
  };

  return (
    <Grid2 container direction="column" sx={{ my: 2 }}>
      <DialogTitle>
        <Typography sx={{ fontSize: 20, fontWeight: "bold" }}>
          Resolver "{selectedItemName}" ?
        </Typography>
      </DialogTitle>
      <Grid2 sx={{ ml: 3, mb: 1 }}>
        <InputLabel>Resolução</InputLabel>
        <TextField
          size="small"
          sx={{ width: "95%" }}
          value={resolution}
          onChange={(e) => setResolution(e.target.value)}
        />
      </Grid2>
      <DialogActions>
        <Button
          variant="contained"
          color="success"
          onClick={handlePrimaryResolve}
          sx={{ mr: 1 }}
        >
          Resolver
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => setOpenDialog(!openDialog)}
        >
          X
        </Button>
      </DialogActions>

      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Atenção</DialogTitle>
        <DialogContent>
          <Typography>
            Resolver esta Entrada de Estoque vai gerar um novo Encargo
            Financeiro{" "}
            {selectedItemPrice && (
              <strong>de R${selectedItemPrice.toFixed(2)}</strong>
            )}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="success" onClick={handleConfirm}>
            OK
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => setConfirmDialogOpen(false)}
          >
            X
          </Button>
        </DialogActions>
      </Dialog>
    </Grid2>
  );
};

export default ResolveForm;
