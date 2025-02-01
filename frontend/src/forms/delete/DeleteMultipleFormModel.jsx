/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
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

const DeleteMultipleFormModel = (props) => {
  const handleDeleteMultiple = async () => {
    try {
      const ids = props.selectedItems.map((item) => item._id).join(",");
      const res = await api.delete(
        `/delete/multiple/${props.userId}/${props.model}/${ids}`
      );

      if (res.data) {
        props.setMultiple(false);
        props.setSelectedMultipleItems([]);
        toast.success(
          `${props.selectedItems.length} itens deletados com sucesso!`,
          {
            closeOnClick: true,
            pauseOnHover: false,
            theme: "colored",
            autoClose: 1200,
          }
        );

        if (props.userId) {
          socket.emit("newDataRefreshButton", {
            page: props.page,
            userId: props.userId,
          });
        }
      }

      props.setOpenDialog(false);
      props.setRefreshData(!props.refreshData);
      api.post("/log", {
        source: props.userId,
        target: res.data,
        label: props.label,
        type: "deleteMultiple",
      });
    } catch (err) {
      toast.error("Houve um erro na deleção...", {
        closeOnClick: true,
        pauseOnHover: false,
        theme: "colored",
        autoClose: 1200,
      });
      console.error(err);
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
          Deletar {props.selectedItems.length} itens?
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Grid sx={{ maxWidth: 200 }}>
            {props.selectedItems.map((item, index) => (
              <Grid item key={index}>
                <Typography>{item.name}</Typography>
              </Grid>
            ))}
          </Grid>
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
            Esta ação é IRREVERSÍVEL e removerá {props.selectedItems.length}{" "}
            itens selecionados!
          </Typography>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="success"
          onClick={handleDeleteMultiple}
          sx={{ mr: 2 }}
        >
          OK
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => props.setOpenDialog(!props.openDialog)}
        >
          X
        </Button>
      </DialogActions>
    </Grid>
  );
};

export default DeleteMultipleFormModel;
