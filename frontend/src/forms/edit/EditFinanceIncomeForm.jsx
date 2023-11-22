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
  TextField,
  Typography,
} from "@mui/material";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function EditFinanceIncomeForm({
  selectedFinanceIncome,
  openEdit,
  setOpenEdit,
  refreshData,
  setRefreshData,
  toast,
}) {
  const [status, setStatus] = React.useState(selectedFinanceIncome.status);
  const previousData = selectedFinanceIncome;

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/positions", {
        positionId: selectedFinanceIncome._id,
        name,
        members: selectedFinanceIncome.members,
        previousData,
      });
      if (res.data) {
        toast.success("Cargo Editado!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
      setOpenEdit(!openEdit);
      setRefreshData(!refreshData);
    } catch (err) {
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
      <DialogTitle>Editando Conta a Receber</DialogTitle>
      <DialogContent>
        <Typography sx={{ my: 1, ml: 4, fontSize: 18, fontWeight: "bold" }}>
          Informações
        </Typography>
        <Grid
          container
          sx={{ mt: 2 }}
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item sx={{ mb: 2, mr: 1 }}>
            <Typography sx={{ mb: 1 }}>Orçamento</Typography>
            <Typography size="small" sx={{ width: 100, color: "#777" }}>
              {previousData.quote}
            </Typography>
          </Grid>
          <Grid item sx={{ mb: 2, mr: 1 }}>
            <Typography sx={{ mb: 1 }}>Colaborador</Typography>
            <Typography size="small" sx={{ width: 130, color: "#777" }}>
              {previousData.user}
            </Typography>
          </Grid>
          <Grid item sx={{ mb: 2, mr: 1 }}>
            <Typography sx={{ mb: 1 }}>Tipo</Typography>
            <Typography size="small" sx={{ width: 80, color: "#777" }}>
              {previousData.type.charAt(0).toUpperCase() +
                previousData.type.slice(1)}
            </Typography>
          </Grid>
          {previousData.service && (
            <Grid item sx={{ mb: 2, mr: 1 }}>
              <Typography sx={{ mb: 1 }}>Serviço</Typography>
              <Typography size="small" sx={{ width: 150, color: "#777" }}>
                {previousData.service}
              </Typography>
            </Grid>
          )}

          <Grid item sx={{ mb: 2, mr: 1 }}>
            <Typography sx={{ mb: 1 }}>Departamento</Typography>
            <Typography size="small" sx={{ width: 150, color: "#777" }}>
              {previousData.department}
            </Typography>
          </Grid>
          <Grid item sx={{ mb: 2, mr: 1 }}>
            <Typography sx={{ mb: 1 }}>Valor</Typography>
            <Typography size="small" sx={{ width: 150, color: "#777" }}>
              R${previousData.price.toFixed(2)}
            </Typography>
          </Grid>
          {previousData.items.length > 0 && (
            <Grid item sx={{ mb: 2, mr: 1 }}>
              <Typography sx={{ mb: 1 }}>Itens</Typography>
              map the items
            </Grid>
          )}
        </Grid>
        <Typography sx={{ my: 1, ml: 4, fontSize: 18, fontWeight: "bold" }}>
          Cliente
        </Typography>
        <Grid
          container
          sx={{ mt: 2 }}
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item sx={{ mb: 2, mr: 1 }}>
            <Typography sx={{ mb: 1 }}>Tipo de Cliente</Typography>
            <Typography size="small" sx={{ width: 100, color: "#777" }}>
              {previousData.customerType}
            </Typography>
          </Grid>
          <Grid item sx={{ mb: 2, mr: 1 }}>
            <Typography sx={{ mb: 1 }}>Cliente</Typography>
            <Typography size="small" sx={{ width: 130, color: "#777" }}>
              {previousData.customer}
            </Typography>
          </Grid>
          <Grid item sx={{ mb: 2, mr: 1 }}>
            <Typography sx={{ mb: 1 }}>Tipo</Typography>
            <Typography size="small" sx={{ width: 80, color: "#777" }}>
              {previousData.type.charAt(0).toUpperCase() +
                previousData.type.slice(1)}
            </Typography>
          </Grid>
          {previousData.service && (
            <Grid item sx={{ mb: 2, mr: 1 }}>
              <Typography sx={{ mb: 1 }}>Serviço</Typography>
              <Typography size="small" sx={{ width: 150, color: "#777" }}>
                {previousData.service}
              </Typography>
            </Grid>
          )}

          <Grid item sx={{ mb: 2, mr: 1 }}>
            <Typography sx={{ mb: 1 }}>Departamento</Typography>
            <Typography size="small" sx={{ width: 150, color: "#777" }}>
              {previousData.department}
            </Typography>
          </Grid>
          <Grid item sx={{ mb: 2, mr: 1 }}>
            <Typography sx={{ mb: 1 }}>Valor</Typography>
            <Typography size="small" sx={{ width: 150, color: "#777" }}>
              R${previousData.price.toFixed(2)}
            </Typography>
          </Grid>
          {previousData.items.length > 0 && (
            <Grid item sx={{ mb: 2, mr: 1 }}>
              <Typography sx={{ mb: 1 }}>Itens</Typography>
              map the items
            </Grid>
          )}
        </Grid>
      </DialogContent>
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
