/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import { Button, DialogContent, DialogTitle, Grid } from "@mui/material";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const GenericDeleteForm = ({
  selectedItem,
  refreshData,
  setRefreshData,
  openDialog,
  setOpenDialog,
  toast,
  endpoint,
  successMessage,
}) => {
  const handleDelete = async () => {
    try {
      const res = await api.delete(`/${endpoint}/${selectedItem._id}`);
      if (res.data) {
        toast.success(successMessage, {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
      setOpenDialog(false);
      setRefreshData(!refreshData)
    } catch (err) {
      alert("Oops, something went wrong...");
      console.log(err);
    }
  };

  return (
    <>
      <DialogTitle>{`Deletar ${
        selectedItem.name || selectedItem.title || selectedItem.quoteNumber
      } ?`}</DialogTitle>
      <DialogContent>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          sx={{ my: 4 }}
        >
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
        </Grid>
      </DialogContent>
    </>
  );
};

export default GenericDeleteForm;
