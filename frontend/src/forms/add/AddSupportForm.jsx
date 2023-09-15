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
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const AddSupportForm = ({
  // openAddJobRequest,
  setOpenAddJobRequest,
  customers,
  departments,
  fetchData,
}) => {
  const [title, setTitle] = React.useState("");
  const [customer, setCustomer] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [requester, setRequester] = React.useState("");
  const [worker, setWorker] = React.useState("");
  const [department, setDepartment] = React.useState("");
  const [service, setService] = React.useState("");
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
      const res = await api.post("/support", {
        type: "Atendimento",
        title,
        description,
        customerId: customer._id,
        requester,
        department: {
          id: department._id,
          name: department.name,
          phone: department.phone,
          color: department.color
        },
        worker,
        manager: department.manager,
        status: "Aberto",
        service,
        price,
        cost,
        local,
        scheduledTo,
      });
      res.data && alert("Pedido Adicionado!");
      setOpenAddJobRequest(false);
      fetchData();
    } catch (err) {
      alert("Vish, deu não...");
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleAdd}>
      <Grid container sx={{ mt: 3 }}>
        <DialogTitle>Novo Pedido - Job</DialogTitle>
      </Grid>

      <DialogContent>
        <Typography sx={{ mb: 1 }}>Informações do Cliente</Typography>
        <Grid
          container
          sx={{ pr: "4%", mt: 2 }}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item>
            <FormControl>
              <Select
                onChange={(e) => {setCustomer(e.target.value), setLocal(e.target.value.address)}}
                value={customer}
                size="small"
                displayEmpty
                renderValue={(selected) => {
                  if (selected.length === 0) {
                    return <Typography>Selecione um Cliente</Typography>;
                  }

                  return selected.name;
                }}
                sx={{ width: 200 }}
              >
                <MenuItem disabled value="">
                  Clientes
                </MenuItem>
                {customers.map((item) => (
                  <MenuItem
                    value={item}
                    key={item._id}
                    sx={{ fontSize: "100%" }}
                  >
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Solicitante"
              size="small"
              value={requester}
              onChange={(e) => setRequester(e.target.value)}
              required
              variant="outlined"
              sx={{ width: 210, ml: 1 }}
            />
            <TextField
              label="Local de Execução"
              size="small"
              value={local}
              onChange={(e) => setLocal(e.target.value)}
              required
              variant="outlined"
              sx={{ width: 240, mx: 1 }}
            />
            <TextField
              label="Agendar para"
              size="small"
              value={scheduledTo}
              onChange={(e) => setScheduledTo(e.target.value)}
              required
              variant="outlined"
              sx={{ width: 140 }}
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
              sx={{ width: "64%", mb: 1, mr: 1 }}
            />
            <TextField
              label="Tipo de Serviço"
              size="small"
              value={service}
              onChange={(e) => setService(e.target.value)}
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
            <Select
              onChange={(e) => setDepartment(e.target.value)}
              value={department}
              displayEmpty
              size="small"
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return <Typography>Departamento</Typography>;
                }

                return (
                  <Typography
                    sx={{
                      backgroundColor: selected.color,
                      color: "white",
                      px: 1,
                    }}
                  >
                    {selected.name}
                  </Typography>
                );
              }}
              sx={{ minWidth: "200px" }}
            >
              {departments.map((item) => (
                <MenuItem
                  value={item}
                  key={item.id}
                  sx={{
                    backgroundColor: item.color,
                    color: "white",
                    "&:hover": {
                      backgroundColor: item.color,
                      color: "white",
                    },
                  }}
                >
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          {department && (
            <>
              <Grid item>
                <Typography sx={{ ml: 2, mt: 1, width: 200, color: "black" }}>
                  Gerente - {department.manager.name}
                </Typography>
              </Grid>
              <Grid item>
                <Select
                  onChange={(e) => setWorker(e.target.value)}
                  value={worker}
                  size="small"
                  sx={{ minWidth: "200px" }}
                  renderValue={(selected) => {
                    if (selected.length === 0) {
                      return <Typography>Colaborador</Typography>;
                    }

                    return <Typography>{selected.name}</Typography>;
                  }}
                >
                  {department.members.map((item) => (
                    <MenuItem
                      value={item}
                      key={item._id}
                      sx={{ fontSize: "100%" }}
                    >
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
            </>
          )}
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">R$</InputAdornment>
                ),
              }}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (inputValue >= 0) {
                  setPrice(inputValue);
                }
              }}
              required
              variant="outlined"
              sx={{ width: 130 }}
            />
          </Grid>
          <Grid item>
            <Typography>Custo</Typography>
            <TextField
              type="number"
              size="small"
              value={cost}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">R$</InputAdornment>
                ),
              }}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (inputValue >= 0) {
                  setCost(inputValue);
                }
              }}
              required
              variant="outlined"
              sx={{ width: 130, mx: 3 }}
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

      <DialogActions>
        <Button type="submit" variant="contained" color="success">
          OK
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => setOpenAddJobRequest(false)}
        >
          X
        </Button>
      </DialogActions>
    </form>
  );
};

export default AddSupportForm;
