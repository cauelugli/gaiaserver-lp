/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";

import {
  Box,
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const AddRequestForm = ({
  openAdd,
  selectedCustomer,
  setOpenAdd,
  option,
  fetchData,
}) => {
  const [title, setTitle] = React.useState("");
  const [type, setType] = React.useState(option);
  const [description, setDescription] = React.useState("");
  const [requester, setRequester] = React.useState("");
  const [worker, setWorker] = React.useState("");
  const [manager, setManager] = React.useState("");
  const [department, setDepartment] = React.useState("");
  const [procedure, setProcedure] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [cost, setCost] = React.useState("");
  const [local, setLocal] = React.useState("");
  const [scheduledTo, setScheduledTo] = React.useState("");

  const [showAdditionalOptions, setShowAdditionalOptions] =
    React.useState(false);

  const handleCheckboxChange = (event) => {
    setShowAdditionalOptions(event.target.checked);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/requests", {
        customerId: selectedCustomer._id,
        title,
        type,
        description,
        requester,
        worker,
        manager,
        department,
        status: "Aberto",
        procedure,
        price,
        cost,
        local,
        scheduledTo,
      });
      res.data && alert("Pedido Adicionado!");
      setOpenAdd(!openAdd);
      fetchData();
    } catch (err) {
      alert("Vish, deu não...");
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleAdd}>
      <Grid container sx={{ mt: 3 }}>
        <DialogTitle>Novo Pedido</DialogTitle>
        <FormControl sx={{ mt:1, width: 155 }}>
          <InputLabel>Tipo</InputLabel>
          <Select
            value={type}
            onChange={(e) => setType(e.target.value)}
            label="Tip"
            size="small"
            required
          >
            <MenuItem value={"Job"}>Job</MenuItem>
            <MenuItem value={"Sale"}>Venda</MenuItem>
            <MenuItem value={"Support"}>Suporte</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {type === "Job" && (
        <DialogContent>
          <Typography sx={{ mb: 1, mt: 2 }}>Informações</Typography>
          <Grid
            container
            sx={{ pr: "4%", mt: 2 }}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid item>
              <TextField
                label="Solicitante"
                size="small"
                value={requester}
                onChange={(e) => setRequester(e.target.value)}
                required
                variant="outlined"
                sx={{ width: 220 }}
              />
              <TextField
                label="Local de Execução"
                size="small"
                value={local}
                onChange={(e) => setLocal(e.target.value)}
                required
                variant="outlined"
                sx={{ width: 385, mx: 2 }}
              />
              <TextField
                label="Agendar para"
                size="small"
                value={scheduledTo}
                onChange={(e) => setScheduledTo(e.target.value)}
                required
                variant="outlined"
                sx={{ width: 180 }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />
          <Typography sx={{ my: 1 }}>Solicitação</Typography>
          <Grid container sx={{ pr: "4%", mt: 2 }} direction="column">
            <Grid item>
              <TextField
                label="Título"
                size="small"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                variant="outlined"
                sx={{ width: "64%", mb: 1, mr:1 }}
              />
              <TextField
                label="Tipo de Serviço"
                size="small"
                value={procedure}
                onChange={(e) => setProcedure(e.target.value)}
                required
                variant="outlined"
                sx={{ width: "35%", mb: 1 }}
              />
              <TextField
                label="Descrição"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                variant="outlined"
                sx={{ width: "100%" }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ mt: -4 }} />
          <Typography sx={{ my: 2 }}>Responsáveis</Typography>
          <Grid container sx={{ pr: "4%" }} direction="row">
            <Grid item>
              <TextField
                label="Funcionário"
                size="small"
                value={worker}
                onChange={(e) => setWorker(e.target.value)}
                required
                variant="outlined"
                sx={{ mr: 1, width: 250 }}
              />
              <TextField
                label="Gerente"
                size="small"
                value={manager}
                onChange={(e) => setManager(e.target.value)}
                required
                variant="outlined"
                sx={{ mr: 1, width: 250 }}
              />
              <TextField
                label="Departamento"
                size="small"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
                variant="outlined"
                sx={{ mr: 1, width: 250 }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />
          <Typography sx={{ my: 2 }}>Orçamento</Typography>
          <Grid container sx={{ pr: "4%", ml: "5%" }} direction="row">
            <Grid item>
              <Typography>Valor</Typography>
              <TextField
                type="number"
                size="small"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                variant="outlined"
                sx={{ width: 100 }}
              />
            </Grid>
            <Grid item>
              <Typography>Custo</Typography>
              <TextField
                type="number"
                size="small"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                required
                variant="outlined"
                sx={{ width: 100, mx: 3 }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 2, mt: 4 }} />
          <Checkbox
            checked={showAdditionalOptions}
            onChange={handleCheckboxChange}
          />
          <label>Observações</label>

          {showAdditionalOptions && (
            <Box>
              <Divider sx={{ my: 2 }} />
            </Box>
          )}
        </DialogContent>
      )}

      <DialogActions>
        <Button type="submit" variant="contained" color="success">
          OK
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => setOpenAdd(!openAdd)}
        >
          X
        </Button>
      </DialogActions>
    </form>
  );
};

export default AddRequestForm;
