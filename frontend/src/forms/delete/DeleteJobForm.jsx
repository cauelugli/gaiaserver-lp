/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";

import { Button, DialogContent, DialogTitle, Grid } from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const DeleteJobForm = ({
  fetchData,
  selectedJob,
  openDelete,
  setOpenDelete,
  toast
}) => {
  const handleDelete = async () => {
    try {
      const res = await api.delete(`/jobs/${selectedJob._id}`);
      if (res.data) {
        toast.success("Pedido Deletado", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          icon: <DeleteIcon />,

        });
      }
      setOpenDelete(false);
      fetchData();
    } catch (err) {
      alert("Vish, deletou não..");
      console.log(err);
    }
  };

  return (
    <>
      <DialogTitle>{`Deletar Job ${selectedJob.title} ?`}</DialogTitle>
      <DialogContent>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          sx={{ my: 4 }}
        >
          <Button
            variant="contained"
            color="success"
            onClick={() => handleDelete()}
            sx={{ mr: 2 }}
          >
            OK
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => setOpenDelete(!openDelete)}
          >
            X
          </Button>
        </Grid>
      </DialogContent>
    </>
  );
};

export default DeleteJobForm;
