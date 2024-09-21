/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import {
  Button,
  DialogActions,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";

const socket = io("http://localhost:5002");
const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const ResolveForm = ({
  userId,
  selectedItemId,
  selectedItemName,
  model,
  refreshData,
  setRefreshData,
  openDialog,
  setOpenDialog,
  page,
}) => {
  const handleResolve = async () => {
    try {
      const resolvedAt = dayjs().format("DD/MM/YYYY HH:mm");

      const res = await api.put(`/actions/resolve/`, {
        model,
        id: selectedItemId,
        resolvedBy: userId,
        resolvedAt,
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

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      sx={{ my: 2 }}
    >
      <DialogTitle>
        <Typography sx={{ fontSize: 20, fontWeight: "bold" }}>
          Resolver {selectedItemName}?
        </Typography>
      </DialogTitle>
      <DialogActions>
        <Button
          variant="contained"
          color="success"
          onClick={handleResolve}
          sx={{ mr: 2 }}
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
    </Grid>
  );
};

export default ResolveForm;
