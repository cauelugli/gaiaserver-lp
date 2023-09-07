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
import MaterialList from "../../components/small/MaterialList";

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
  const [materials, setMaterials] = React.useState(service.materials || []);
  const [materialsCost, setMaterialsCost] = React.useState(
    service.materialsCost || 0
  );
  const [local, setLocal] = React.useState("");
  const [scheduledTo, setScheduledTo] = React.useState(dayjs());

  const [customers, setCustomers] = React.useState([]);
  const [departments, setDepartments] = React.useState([]);
  const [services, setServices] = React.useState([]);
  const [stockItems, setStockItems] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const customers = await api.get("/customers");
        const departments = await api.get("/departments");
        const services = await api.get("/services");
        const stockItems = await api.get("/stockItems");
        setCustomers(customers.data);
        setDepartments(departments.data);
        setServices(services.data);
        setStockItems(stockItems.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  React.useEffect(() => {
    console.log("service", service);
    setMaterials(materials);
    setMaterialsCost(materialsCost);
  }, [materials, materialsCost, service]);

  const handleServiceChange = (service) => {
    console.log("service", service);
    setService(service);
    setMaterials(service.materials);
    setMaterialsCost(service.materialsCost);
  };

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
        service: {
          _id: service._id || service.id,
          name: service.name,
          value: service.value,
          department: service.department,
        },
        materials,
        materialsCost,
        price: service.value + materialsCost,
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
                setDepartment(e.target.value),
                  setService(""),
                  setWorker(""),
                  setMaterials([]),
                  setMaterialsCost(0);
              }}
              value={department}
              size="small"
              renderValue={(selected) => {
                if (!selected) {
                  return <Typography>Departamento</Typography>;
                } else {
                  return <Typography>{selected.name}</Typography>;
                }
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
                  onChange={(e) => {
                    handleServiceChange(e.target.value);
                  }}
                  value={service}
                  size="small"
                  renderValue={(selected) => {
                    if (!selected) {
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

        {service && (
          <Grid container justifyContent="center" alignItems="center">
            <Grid
              sx={{
                width: 1000,
                border: "1px solid #777",
                borderRadius: 4,
                p: 3,
              }}
            >
              <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                  width: "100%",
                  border: "1px solid #ccc",
                  borderRadius: 4,
                  mb: 1,
                }}
              >
                <Typography sx={{ fontSize: 16, p: 2 }}>Serviço</Typography>
                <Typography sx={{ fontSize: 16, p: 2 }}>
                  {service && `${service.name} = `}{" "}
                  {service.value ? `R$ ${service.value}` : "R$0,00"}
                </Typography>
              </Grid>
              <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                  width: "100%",
                  border: "1px solid #ccc",
                  borderRadius: 4,
                  my: 2,
                }}
              >
                <Typography sx={{ fontSize: 16, p: 2 }}>Materiais</Typography>
                <Grid
                  container
                  direction="column"
                  justifyContent="space-between"
                  alignItems="flex-end"
                  sx={{
                    width: "50%",
                    borderRadius: 4,
                  }}
                >
                  {materials.map((material) => (
                    <Typography sx={{ px: 2, my: 0.5 }} key={material.id}>
                      {material.name} x{material.quantity}= R$
                      {material.sellValue * material.quantity}
                    </Typography>
                  ))}
                </Grid>
              </Grid>
              <Grid
                container
                direction="row"
                justifyContent="space-between"
                sx={{
                  width: "100%",
                  border: "1px solid #ccc",
                  borderRadius: 4,
                  mb: 1,
                }}
              >
                <Typography sx={{ fontSize: 16, p: 2 }}>Total</Typography>
                <Typography sx={{ fontSize: 16, p: 2 }}>
                  {service && `R$ ${service.materialsCost + service.value}`}
                </Typography>
              </Grid>
              {/* <Grid
              sx={{
                width: 700,
                height: 250,
                border: "1px solid #ccc",
                borderRadius: 4,
              }}
            >
              <Typography sx={{ fontSize: 16, p: 2 }}>Materiais</Typography>
              <Typography sx={{ my: 1, px: 2 }}>{materials.length}</Typography>
            </Grid> */}
              {/* {materials.length > 0 ? (
              <>
                <MaterialList
                  stockItems={stockItems}
                  materials={materials}
                  setMaterials={setMaterials}
                  materialsAddJobCost={materialsCost}
                  setMaterialsFinalCost={setMaterialsCost}
                />
              </>
            ) : (
              <Typography sx={{ fontSize: 16 }}>Não há Materiais</Typography>
            )} */}
            </Grid>
          </Grid>
        )}

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
