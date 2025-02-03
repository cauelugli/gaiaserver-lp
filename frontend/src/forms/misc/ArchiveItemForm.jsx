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
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";

const ArchiveItemForm = ({
  userId,
  selectedItem,
  model,
  refreshData,
  setRefreshData,
  openDialog,
  setOpenDialog,
  page,
  label,
}) => {
  const handleArchive = async () => {
    try {
      const res = await api.put("/actions/archiveItem", {
        model: model,
        itemId: selectedItem._id || selectedItem.id,
        isUnarchive: selectedItem.status === "Arquivado",
      });
      if (res.data || res.status === 200) {
        toast.success(
          `Item ${
            selectedItem.status === "Arquivado" ? "Desarquivado" : "Arquivado"
          }`,
          {
            closeOnClick: true,
            pauseOnHover: false,
            theme: "colored",
            autoClose: 1200,
          }
        );

        if (userId) {
          socket.emit("newDataRefreshButton", {
            page,
            userId: userId,
          });
        }
      }
      setOpenDialog(false);
      setRefreshData(!refreshData);
      api.post("/log", {
        source: userId,
        target: res.data,
        label: label,
        type: selectedItem.status === "Arquivado" ? "unarchive" : "archive",
      });
    } catch (err) {
      toast.error("Houve algum erro...", {
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
          {selectedItem.status === "Arquivado" ? "Desarquivar" : "Arquivar"}{" "}
          {selectedItem.name ||
            selectedItem.title ||
            selectedItem.quoteNumber ||
            selectedItem.number}
          ?
        </Typography>
      </DialogTitle>
      <DialogActions>
        <Button
          variant="contained"
          color="success"
          onClick={handleArchive}
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

export default ArchiveItemForm;
