/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { toast } from "react-toastify";

const socket = io("http://localhost:5002");
const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";

const DeleteFormModel = ({
  userId,
  selectedItem,
  model,
  refreshData,
  setRefreshData,
  openDialog,
  setOpenDialog,
  page,
}) => {
  const handleDelete = async () => {
    try {
      const res = await api.delete(`/delete/${userId}/${model}/${selectedItem._id}`);
      if (res.data) {
        toast.success(`${selectedItem.name} Deletado!`, {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });

        if (userId) {
          socket.emit("newDataRefreshButton", {
            page,
            userId: userId,
          });
        }
      }
      setOpenDialog(false);
      setRefreshData(!refreshData);
    } catch (err) {
      toast.error("Houve um erro na deleção...", {
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
          Deletar{" "}
          {selectedItem.name ||
            selectedItem.title ||
            selectedItem.quoteNumber ||
            selectedItem.number}
          ?
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Typography
            sx={{
              mt: 2,
              mb: 1,
              fontSize: 18,
              fontWeight: "bold",
              color: "darkred",
            }}
          >
            AVISO
          </Typography>
          <Typography sx={{ mb: 2, fontSize: 18, fontWeight: "bold" }}>
            Esta ação é IRREVERSÍVEL!
          </Typography>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="success"
          onClick={handleDelete}
          sx={{ mr: 2 }}
        >
          OK
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

export default DeleteFormModel;
