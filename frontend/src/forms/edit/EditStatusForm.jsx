/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";

import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";

import EastIcon from "@mui/icons-material/East";
import FormEndLineTenant from "../../components/small/FormEndLineTenant";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function EditStatusForm({
  openEdit,
  prevStatus,
  newData,
  endpoint,
  selectedItem,
  setOpenEdit,
  refreshData,
  setRefreshData,
  configCustomization,
  toast,
}) {
  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(endpoint, {
        id: selectedItem._id,
        status: newData,
      });
      if (res.data) {
        toast.success("Status Alterado!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
      setOpenEdit(!openEdit);
      setRefreshData(!refreshData);
    } catch (err) {
      console.log(err);
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
      <DialogTitle sx={{ fontWeight: "bold" }}>Editando Status</DialogTitle>
      <DialogContent>
        <Typography variant="h6" sx={{ fontSize: 16, mt: 1, mb: 4, ml: 2 }}>
          Confirmar Alteração de Status
        </Typography>
        <Grid
          container
          sx={{ mt: 2 }}
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item sx={{ mb: 2 }}>
            <Grid
              container
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Grid item>
                <Grid container direction="column">
                  <Typography
                    sx={{
                      fontSize: 16,
                      mb: 1,
                      fontWeight: "bold",
                      color: "#777",
                    }}
                  >
                    Anterior
                  </Typography>
                  <Typography>{prevStatus}</Typography>
                </Grid>
              </Grid>

              <Grid item sx={{ mx: 5 }}>
                <EastIcon />
              </Grid>

              <Grid item>
                <Grid container direction="column">
                  <Typography sx={{ fontSize: 16, mb: 1, fontWeight: "bold" }}>
                    Novo
                  </Typography>
                  <Typography>{newData}</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <FormEndLineTenant configCustomization={configCustomization} />
      <DialogActions>
        <Button type="submit" variant="contained" color="success">
          OK
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => setOpenEdit(!openEdit)}
        >
          X
        </Button>
      </DialogActions>
    </form>
  );
}
