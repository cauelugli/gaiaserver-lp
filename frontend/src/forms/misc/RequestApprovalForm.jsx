/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
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

const RequestApprovalForm = (props) => {
  const handleRequestApproval = async () => {
    try {
      const requestedAt = dayjs().format("DD/MM/YYYY HH:mm");

      const res = await api.put(`/actions/requestApproval/`, {
        model: props.model,
        id: props.selectedItemId,
        requestedBy: props.userId,
        requestedAt,
        usesWebsocket: true,
      });

      if (res.data) {
        toast.success(`Aprovação Solicitada`, {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });

        if (props.userId) {
          socket.emit("newDataRefreshButton", {
            page: props.page,
            userId: props.userId,
          });
        }
      }
      props.setOpenDialog(false);
      props.setRefreshData(!props.refreshData);
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
          Solicitar Aprovação para {props.selectedItemName}?
        </Typography>
      </DialogTitle>
      <DialogActions>
        <Button
          variant="contained"
          color="success"
          onClick={handleRequestApproval}
          sx={{ mr: 2 }}
        >
          Confirmar
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

export default RequestApprovalForm;
