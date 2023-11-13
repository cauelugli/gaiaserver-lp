/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";

import { Button, DialogContent, DialogTitle, Grid } from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const DeleteDepartmentForm = ({
  selectedDepartment,
  openDelete,
  setOpenDelete,
  toast,
}) => {
  const department = selectedDepartment;

  const handleDelete = async () => {
    try {
      const res = await api.delete(
        `/departments/${department._id}?selectedDepartment=${JSON.stringify(
          department
        )}`
      );
      if (res.data) {
        toast.error("Departamento Deletado", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
          icon: <DeleteIcon />
        });
      }
      setOpenDelete(false);
    } catch (err) {
      alert("Vish, deletou não..");
      console.log(err);
    }
  };

  return (
    <>
      <DialogTitle>{`Deletar Departamento ${department.name} ?`}</DialogTitle>
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

export default DeleteDepartmentForm;
