/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5002");

import {
  Button,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const ResolveSaleForm = ({
  userName,
  userId,
  selectedItem,
  refreshData,
  setRefreshData,
  setOpenDialog,
  toast,
  successMessage,
}) => {
  const [commentary, setCommentary] = React.useState("");

  const handleResolveSale = async () => {
    try {
      const res = await api.put(`/sales/resolve`, {
        saleId: selectedItem._id,
        user: userName,
        commentary,
      });
      if (res.data) {
        toast.success(successMessage, {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
        socket.emit("newDataRefreshButton", {
          page: "requests",
          userId: userId,
        });
      }
      setOpenDialog(false);
      setRefreshData(!refreshData);
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
    <>
      <DialogTitle>Concluindo Venda</DialogTitle>
      <DialogContent>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Comentários (opcional)"
          value={commentary}
          onChange={(e) => setCommentary(e.target.value)}
          fullWidth
          sx={{ mt: 1 }}
        />
        <Grid
          container
          justifyContent="flex-end"
          alignItems="flex-end"
          sx={{ my: 4 }}
        >
          <Button
            variant="contained"
            color="success"
            onClick={handleResolveSale}
            sx={{ mr: 2 }}
          >
            OK
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => setOpenDialog(false)}
          >
            X
          </Button>
        </Grid>
      </DialogContent>
    </>
  );
};

export default ResolveSaleForm;
