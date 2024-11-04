/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";
import axios from "axios";

import {
  Avatar,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";

import { icons } from "../../icons";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const DeleteOperatorForm = ({
  openDelete,
  setOpenDelete,
  selectedOperator,
  refreshData,
  setRefreshData,
  toast
}) => {
  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/operators", {
        operatorId: selectedOperator._id,
        operator: selectedOperator,
        option: "delete"
      });
      if (res.data) {
        toast.error("Operador Deletado", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
          icon: <icons.DeleteIcon />,
        });
      }
      setOpenDelete(!openDelete);
      setRefreshData(!refreshData);
    } catch (err) {
      console.log("err", err)
      if (err.response && err.response.status === 422) {
        toast.error(err.response.data.error, {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      } else {
        toast.error("Houve algum erro...", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
    }
  };

  return (
    <form onSubmit={handleEdit}>
      <DialogTitle>Deletar Operador - {selectedOperator.name}</DialogTitle>
      <DialogContent>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item>
            <Avatar
              alt="Imagem do Usuário"
              src={`http://localhost:3000/static/${selectedOperator.image}`}
              sx={{
                width: 200,
                height: 200,
              }}
            />
          </Grid>

          <Grid item sx={{ mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              color="success"
              sx={{ mr: 1 }}
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
        </Grid>
      </DialogContent>
      <DialogActions></DialogActions>
    </form>
  );
};

export default DeleteOperatorForm;
