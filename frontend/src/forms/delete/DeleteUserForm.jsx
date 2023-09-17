/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";
import axios from "axios";

import { Button, DialogContent, DialogTitle, Grid } from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";


const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const DeleteUserForm = ({
  selectedUser,
  openDelete,
  setOpenDelete,
  fetchData,
  toast,
}) => {
  const user = selectedUser;

  const handleDelete = async () => {
    try {
      const res = await api.delete(`/users/${user._id}`);
      if (res.data) {
        toast.warning("Colaborador Deletado", {
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
      <DialogTitle>{`Deletar Colaborador ${user.name} ?`}</DialogTitle>
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

export default DeleteUserForm;
