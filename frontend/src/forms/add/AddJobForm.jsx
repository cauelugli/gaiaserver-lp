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
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import TaskIcon from "@mui/icons-material/Task";
import CreateIcon from "@mui/icons-material/Create";
import CheckIcon from "@mui/icons-material/Check";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";
import MaterialList from "../../components/small/MaterialList";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const AddJobForm = ({ openAddJob, setOpenAddJob, fetchData1, toast }) => {
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
  const [editQuote, setEditQuote] = React.useState(false);
  const [approvedQuote, setApprovedQuote] = React.useState(false);

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

  const handleServiceChange = (service) => {
    setService(service);
    setMaterials(service.materials);
    setMaterialsCost(service.materialsCost);
  };

  const handleApproveQuote = () => {
    setApprovedQuote(true);
  };

  const handleEditQuote = () => {
    setEditQuote(!editQuote);
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
      if (res.data) {
        toast.success(`Pedido Adicionado! Orçamento #${res.data.quoteNumber}`);
      }
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
        <Typography sx={{ mb: 1, fontSize: 18, fontWeight: "bold" }}>
          Informações do Cliente
        </Typography>
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
        <Typography sx={{ my: 2, fontSize: 18, fontWeight: "bold" }}>
          Departamento
        </Typography>
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
              disabled={approvedQuote}
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
                  disabled={approvedQuote}
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
        <Typography sx={{ my: 1, fontSize: 18, fontWeight: "bold" }}>
          Solicitação
        </Typography>
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
        <Typography sx={{ my: 2, fontSize: 18, fontWeight: "bold" }}>
          Orçamento
        </Typography>
        {!editQuote ? (
          <div style={{ color: approvedQuote ? "#777" : "black" }}>
            {service && (
              <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
              >
                <Grid
                  sx={{
                    width: 750,
                    backgroundColor: "#eee",
                    p: 3,
                  }}
                >
                  <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                    Serviço
                  </Typography>
                  <Grid
                    container
                    direction="row"
                    sx={{
                      width: "70%",
                      borderRadius: 4,
                      py: 2,
                    }}
                  >
                    <Typography sx={{ fontSize: 16, mx: 1 }}>
                      {service && `${service.name} = `}{" "}
                      {service.value ? `R$ ${service.value}` : "R$0,00"}
                    </Typography>
                  </Grid>
                  <Typography sx={{ fontSize: 16, mt: 2, fontWeight: "bold" }}>
                    Materiais
                  </Typography>

                  <Grid
                    container
                    direction="row"
                    sx={{
                      width: "70%",
                      borderRadius: 4,
                      py: 2,
                    }}
                  >
                    <Grid
                      item
                      sx={{
                        borderRadius: 4,
                      }}
                    >
                      {materials.map((material) => (
                        <Typography
                          sx={{ my: 0.5, ml: 1, fontSize: 16 }}
                          key={material.id}
                        >
                          {material.name} x{material.quantity} = R$
                          {material.sellValue * material.quantity}
                        </Typography>
                      ))}
                    </Grid>
                  </Grid>
                  <Typography sx={{ fontSize: 16, mt: 2, fontWeight: "bold" }}>
                    Total
                  </Typography>

                  <Grid
                    container
                    direction="row"
                    sx={{
                      width: "70%",
                      borderRadius: 4,
                      py: 2,
                    }}
                  >
                    <Typography sx={{ fontSize: 16, mx: 1 }}>
                      Serviço + Materiais ={" "}
                      {service && `R$ ${materialsCost + service.value}`}
                    </Typography>
                  </Grid>
                </Grid>

                {!approvedQuote ? (
                  <Grid item sx={{ m: 2 }}>
                    <Button
                      sx={{ mx: 2 }}
                      variant="contained"
                      color="success"
                      startIcon={<TaskIcon />}
                      onClick={handleApproveQuote}
                    >
                      Aprovar
                    </Button>
                    <Button
                      variant="contained"
                      color="warning"
                      startIcon={<CreateIcon />}
                      onClick={handleEditQuote}
                    >
                      Editar
                    </Button>
                  </Grid>
                ) : (
                  <Typography sx={{ m: 1, color: "green" }}>
                    Este Orçamento foi Aprovado!
                  </Typography>
                )}
              </Grid>
            )}
          </div>
        ) : (
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Grid
              item
              sx={{
                width: 850,
                backgroundColor: "#eee",
                p: 3,
              }}
            >
              <MaterialList
                stockItems={stockItems}
                materials={materials}
                materialsEditCost={materialsCost}
                setMaterials={setMaterials}
                setMaterialsFinalCost={setMaterialsCost}
              />
            </Grid>
            <Grid item sx={{ m: 2 }}>
              <Button
                sx={{ mx: 2 }}
                variant="contained"
                color="success"
                startIcon={<CheckIcon />}
                onClick={handleEditQuote}
              >
                Alterar
              </Button>
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
