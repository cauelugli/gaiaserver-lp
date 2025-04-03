/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
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
      }

      props.setOpenDialog(false);
      props.setRefreshData(!props.refreshData);
      api.post("/log", {
        source: props.userId,
        target: props.selectedItems,
        label: props.label,
        type: "deleteMultiple",
        targetModel: props.model,
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
    <Grid2
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
        <Grid2
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Grid2 sx={{ maxWidth: 200 }}>
            {props.selectedItems.map((item, index) => (
              <Grid2 item key={index}>
                <Typography>{item.name}</Typography>
              </Grid2>
            ))}
          </Grid2>
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
        </Grid2>
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
    </Grid2>
  );
};

export default DeleteMultipleFormModel;
