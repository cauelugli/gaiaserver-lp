/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import dayjs from "dayjs";

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
  // InputAdornment,
  MenuItem,
  // Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const AddJobForm = ({ openAddJob, setOpenAddJob, fetchData1 }) => {
  const [title, setTitle] = React.useState("");
  const [customer, setCustomer] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [requester, setRequester] = React.useState("");
  const [worker, setWorker] = React.useState("");
  const [department, setDepartment] = React.useState("");
  const [service, setService] = React.useState("");
  // const [price, setPrice] = React.useState("");
  const [local, setLocal] = React.useState("");
  const [scheduledTo, setScheduledTo] = React.useState(dayjs());

  const [customers, setCustomers] = React.useState([]);
  const [departments, setDepartments] = React.useState([]);
  const [services, setServices] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const customers = await api.get("/customers");
        const departments = await api.get("/departments");
        const services = await api.get("/services");
        setCustomers(customers.data);
        setDepartments(departments.data);
        setServices(services.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const [showAdditionalOptions, setShowAdditionalOptions] =
    React.useState(false);

  const handleCheckboxChange = (event) => {
    setShowAdditionalOptions(event.target.checked);
  };

  const handleCustomerChange = (customer) => {
    setCustomer(customer);
    setRequester(customer.mainContactName);
    setLocal(customer.address);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/jobs", {
        title,
        description,
        customer: { id: customer._id, name: customer.name },
        requester,
        department: {
          id: department._id,
          name: department.name,
          phone: department.phone,
          color: department.color,
        },
        worker,
        manager: department.manager,
        status: "Aberto",
        service,
        price: 100,
        local,
        scheduledTo,
      });
      res.data &&
        alert(`Pedido Adicionado! Orçamento #${res.data.quoteNumber}`);
      setOpenAddJob(!openAddJob);
      fetchData1;
    } catch (err) {
      alert("Vish, deu não...");
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleAdd}>
      <Grid container sx={{ mt: 3 }}>
        <DialogTitle>Novo Job</DialogTitle>
      </Grid>

      <DialogContent>
        <Typography sx={{ mb: 1 }}>Informações do Cliente</Typography>
        <Grid
          container
          sx={{ pr: "4%", mt: 2 }}
          direction="row"
          justifyContent="center"
          alignItems="flex-start"
        >
          <Grid item>
            <FormControl>
              <Select
                onChange={(e) => handleCustomerChange(e.target.value)}
                value={customer}
                displayEmpty
                renderValue={(selected) => {
                  if (selected.length === 0) {
                    return <Typography>Selecione um Cliente</Typography>;
                  }

                  return selected.name;
                }}
                sx={{ width: 250 }}
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
          </Grid>
          <Grid item>
            <TextField
              label="Solicitante"
              value={requester}
              onChange={(e) => setRequester(e.target.value)}
              required
              variant="outlined"
              sx={{ width: 250, ml: 1 }}
            />
          </Grid>
          <Grid item>
            <TextField
              label="Local de Execução"
              value={local}
              onChange={(e) => setLocal(e.target.value)}
              required
              variant="outlined"
              sx={{ width: 300, mx: 1 }}
            />
          </Grid>
          <Grid item sx={{ mt: -1 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  value={scheduledTo}
                  format="DD/MM/YYYY"
                  onChange={(newValue) => setScheduledTo(newValue)}
                  label="Agendar para"
                  sx={{ width: 180 }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Grid>
        </Grid>

        <Divider sx={{ mt: 2 }} />
        <Typography sx={{ my: 2 }}>Departamento</Typography>
        <Grid container sx={{ pr: "4%" }} direction="row">
          <Grid item>
            <Select
              onChange={(e) => {
                setDepartment(e.target.value), setService(""), setWorker("");
              }}
              value={department}
              displayEmpty
              size="small"
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return <Typography>Departamento</Typography>;
                }

                return <Typography>{selected.name}</Typography>;
              }}
              sx={{ minWidth: "200px" }}
            >
              {departments.map((item) => (
                <MenuItem
                  value={item}
                  key={item.id}
                  sx={{
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
          <Grid item sx={{ ml: 2, mt: -7 }}>
            {department && (
              <>
                <Typography sx={{ my: 2 }}>Serviço</Typography>
                <Select
                  onChange={(e) => setService(e.target.value)}
                  value={service}
                  displayEmpty
                  size="small"
                  renderValue={(selected) => {
                    if (selected.length === 0) {
                      return <Typography>Escolha um Serviço</Typography>;
                    } else {
                      return <Typography>{selected.name}</Typography>;
                    }
                  }}
                  sx={{ width: 250 }}
                >
                  {services
                    .filter(
                      (service) => service.department.id === department._id
                    )
                    .map((item) => (
                      <MenuItem value={item} key={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                </Select>
              </>
            )}
          </Grid>

          <Grid item sx={{ ml: 2, mt: -7 }}>
            {department && service && (
              <>
                <Typography sx={{ my: 2 }}>Colaborador</Typography>
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
              </>
            )}
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
              fullWidth
              sx={{ mb: 1 }}
            />

            <TextField
              label="Descrição"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              variant="outlined"
              fullWidth
              sx={{ mb: 1 }}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />
        <Typography sx={{ my: 2 }}>Orçamento</Typography>
        <Grid container sx={{ pr: "4%", ml: "5%" }} direction="row">
          <Grid item>
            {/* <Grid item sx={{ ml: 2, mt: -7 }}>
              {department && service && service.materials.length > 0 && (
                <>
                  <Typography sx={{ my: 2 }}>Materiais Utilizados</Typography>
                  <Paper
                    sx={{ width: 150, height: 70, pl: 1, overflow: "auto" }}
                  >
                    <ol style={{ paddingLeft: "0px" }}>
                      {service.materials.map((material) => (
                        <Grid key={material._id} container direction="row">
                          <Typography sx={{ fontSize: "14px", color: "#444" }}>
                            {material.name}
                          </Typography>
                          <Typography sx={{ fontSize: "14px", color: "#444" }}>
                            {"\u00A0"}x{material.quantity}
                          </Typography>
                        </Grid>
                      ))}
                    </ol>
                  </Paper>
                </>
              )}
            </Grid> */}
            {/* <Typography>Valor</Typography>
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
            /> */}
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
          onClick={() => setOpenAddJob(!openAddJob)}
        >
          X
        </Button>
      </DialogActions>
    </form>
  );
};

export default AddJobForm;
