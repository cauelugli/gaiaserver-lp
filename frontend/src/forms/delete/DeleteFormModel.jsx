/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import toast from "react-hot-toast";
const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid2,
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
  label,
  isProduct,
}) => {
  const handleDelete = async () => {
    try {
      const endpoint = isProduct
        ? `/delete/product/${selectedItem.id}`
        : `/delete/${userId}/${model}/${selectedItem._id}`;

      const res = await api.delete(endpoint);

      if (res.data || res.status === 200) {
        toast.success(
          `${
            selectedItem.name || selectedItem.title || selectedItem.number
          } Deletado!`,
          {
            closeOnClick: true,
            pauseOnHover: false,
            theme: "colored",
            autoClose: 1200,
          }
        );
      }
      setOpenDialog(false);
      setRefreshData(!refreshData);
      api.post("/log", {
        source: userId,
        target: selectedItem,
        label: label,
        type: "delete",
        targetModel: model,
      });
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
    <Grid2
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      sx={{ my: 2 }}
    >
      <DialogTitle>
        <Typography sx={{ fontSize: 20, fontWeight: "bold" }}>
          Deletar{" "}
          {selectedItem.name || selectedItem.title || selectedItem.number}?
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Grid2
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
        </Grid2>
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
    </Grid2>
  );
};

export default DeleteFormModel;
