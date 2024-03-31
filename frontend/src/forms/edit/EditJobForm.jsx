/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import dayjs from "dayjs";

import {
  Avatar,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";
import CustomerSelect from "../../components/small/selects/CustomerSelect";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const EditJobForm = ({
  // user,
  openEditJob,
  setOpenEditJob,
  selectedJob,
  refreshData,
  setRefreshData,
  toast,
}) => {
  const [title, setTitle] = React.useState(selectedJob.title);
  const [description, setDescription] = React.useState(selectedJob.description);
  const [customer, setCustomer] = React.useState(selectedJob.customer);
  const [customerType, setCustomerType] = React.useState(
    selectedJob.customer.cpf ? "Pessoa Física" : "Empresa"
  );
  const [requester, setRequester] = React.useState(selectedJob.requester);
  const [worker, setWorker] = React.useState(selectedJob.worker);
  const [department, setDepartment] = React.useState(selectedJob.department);
  const [service, setService] = React.useState(selectedJob.service);
  const [price, setPrice] = React.useState(selectedJob.price);
  const [materials, setMaterials] = React.useState(selectedJob.materials);
  const [materialsCost, setMaterialsCost] = React.useState(
    selectedJob.materialsCost
  );
  const [local, setLocal] = React.useState(selectedJob.local);
  const [scheduledTo, setScheduledTo] = React.useState(
    dayjs(selectedJob.scheduledTo)
  );

  const [departments, setDepartments] = React.useState([]);
  const [services, setServices] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const departmentsResponse = await api.get("/departments");
        const servicesResponse = await api.get("/services");

        setDepartments(
          departmentsResponse.data.filter(
            (department) => department.type === "Serviços"
          )
        );
        setServices(servicesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleCustomerTypeChange = (type) => {
    setCustomerType(type);
    setCustomer("");
    setRequester("");
    setLocal("");
  };

  const handleCustomerChange = (customer) => {
    setCustomer(customer);
    setRequester(customer.mainContactName || customer.name);
    setLocal(customer.address || customer.addressHome);
  };

  const handleServiceChange = (service) => {
    setService(service);
    setMaterials(service.materials);
    setMaterialsCost(service.materialsCost);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const requestBody = {
      jobId: selectedJob._id,
      title,
      customer,
      customerType,
      description,
      requester,
      department: {
        id: department._id,
        name: department.name,
        phone: department.phone,
        color: department.color,
      },
      worker: selectedJob.worker,
      manager: selectedJob.manager,
      materials,
      materialsCost,
      service,
      price,
      local,
      scheduledTo,
    };

    try {
      const res = await api.put("/jobs/edit", requestBody);

      if (res.data) {
        toast.success("Solicitação Editada!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
      setOpenEditJob(!openEditJob);
      setRefreshData(!refreshData);
    } catch (err) {
      toast.error("Houve algum erro...", {
        closeOnClick: true,
        pauseOnHover: false,
        theme: "colored",
        autoClose: 1200,
      });
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleEdit}>
      <Grid container sx={{ mt: 3 }}>
        <DialogTitle>
          Editando Job
        </DialogTitle>
      </Grid>

      <>
        <DialogContent>
          <Grid container>
            <Typography sx={{ mb: 1, fontSize: 18, fontWeight: "bold" }}>
              Informações do Cliente
            </Typography>
            <CheckCircleOutlineOutlinedIcon
              sx={{
                color:
                  customerType && customer && requester && local && scheduledTo
                    ? "#50C878"
                    : "lightgrey",
                ml: 1,
              }}
            />
          </Grid>
          <Grid
            container
            sx={{ mt: 2 }}
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
          >
            <Grid item>
              <FormControl>
                <Select
                  onChange={(e) => handleCustomerTypeChange(e.target.value)}
                  value={customerType}
                  required
                  displayEmpty
                  renderValue={(selected) => {
                    if (!selected) {
                      return <Typography>Tipo de Cliente</Typography>;
                    }

                    return selected;
                  }}
                  sx={{ width: 180 }}
                >
                  <MenuItem disabled value="">
                    Tipo de Cliente
                  </MenuItem>
                  <MenuItem value={"Empresa"}>Empresa</MenuItem>
                  <MenuItem value={"Pessoa Fisica"}>Pessoa Física</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {customerType && (
              <CustomerSelect
                marginAddJobForm
                handleCustomerChange={handleCustomerChange}
                setCustomer={setCustomer}
                customerType={customerType}
                selectedCustomer={customer}
                fromShortcut={Boolean(false)}
              />
            )}
            {customer && (
              <Grid item>
                <TextField
                  label="Solicitante"
                  value={requester}
                  onChange={(e) => setRequester(e.target.value)}
                  required
                  variant="outlined"
                  sx={{ width: 190 }}
                />
              </Grid>
            )}
            {requester && (
              <Grid item>
                <TextField
                  label="Local de Execução"
                  value={local}
                  onChange={(e) => setLocal(e.target.value)}
                  required
                  variant="outlined"
                  sx={{ width: 220, mx: 1 }}
                />
              </Grid>
            )}
            {local && (
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
            )}
          </Grid>

          {local && (
            <Grid sx={{ mr: 10 }}>
              <Divider sx={{ my: 3 }} />
              <Grid container>
                <Typography sx={{ mb: 2, fontSize: 18, fontWeight: "bold" }}>
                  Departamento
                </Typography>
                <CheckCircleOutlineOutlinedIcon
                  sx={{
                    color:
                      department && service && worker ? "#50C878" : "lightgrey",
                    ml: 1,
                  }}
                />
              </Grid>

              <Grid
                container
                direction="row"
                alignItems="flex-start"
                justifyContent="space-between"
              >
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
                    displayEmpty
                    required
                    renderValue={(selected) => {
                      if (!selected) {
                        return (
                          <Typography>Selecione o Departamento</Typography>
                        );
                      } else {
                        return (
                          <Grid container direction="row">
                            <Paper
                              elevation={0}
                              sx={{
                                mr: 1,
                                mt: 0.5,
                                width: 15,
                                height: 15,
                                borderRadius: 50,
                                backgroundColor: selected.color,
                              }}
                            />
                            <Typography>{selected.name}</Typography>
                          </Grid>
                        );
                      }
                    }}
                    sx={{ minWidth: "200px" }}
                  >
                    {departments.map((item) => (
                      <MenuItem value={item} key={item.id}>
                        <Grid container direction="row">
                          <Paper
                            elevation={0}
                            sx={{
                              mr: 1,
                              mt: 0.5,
                              width: 15,
                              height: 15,
                              borderRadius: 50,
                              backgroundColor: item.color,
                            }}
                          />
                          <Typography>{item.name}</Typography>
                        </Grid>
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item sx={{ mt: -7, mx: -10 }}>
                  {department && (
                    <Grid sx={{ mt: 4 }}>
                      <Typography>Serviço</Typography>
                      <Select
                        onChange={(e) => {
                          handleServiceChange(e.target.value);
                        }}
                        required
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
                            (service) =>
                              service.department &&
                              service.department.id === department._id
                          )

                          .map((item) => (
                            <MenuItem value={item} key={item.id}>
                              {item.name}
                            </MenuItem>
                          ))}
                      </Select>
                    </Grid>
                  )}
                </Grid>

                <Grid item sx={{ mt: -7 }}>
                  {department && service && (
                    <Grid sx={{ mt: 4 }}>
                      <Typography>Colaborador</Typography>
                      <Select
                        onChange={(e) => setWorker(e.target.value)}
                        value={worker}
                        size="small"
                        displayEmpty
                        required
                        renderValue={(selected) => {
                          if (selected.length === 0) {
                            return (
                              <Typography>Selecione o Colaborador</Typography>
                            );
                          } else {
                            return (
                              <Grid container direction="row">
                                <Avatar
                                  alt="Imagem do Colaborador"
                                  src={`http://localhost:3000/static/${selected.image}`}
                                  sx={{ width: 22, height: 22, mr: 1 }}
                                />
                                <Typography>{selected.name}</Typography>
                              </Grid>
                            );
                          }
                        }}
                      >
                        <MenuItem disabled value="">
                          Colaboradores
                        </MenuItem>
                        {department &&
                          department.members &&
                          department.members.map((item) => (
                            <MenuItem value={item} key={item.id}>
                              <Avatar
                                alt="Imagem do Colaborador"
                                src={`http://localhost:3000/static/${item.image}`}
                                sx={{ width: 22, height: 22, mr: 2 }}
                              />
                              {item.name}
                            </MenuItem>
                          ))}
                      </Select>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
          )}

          {worker && (
            <Grid sx={{ mr: 10 }}>
              <Divider sx={{ my: 3 }} />
              <Grid container>
                <Typography sx={{ mb: 1, fontSize: 18, fontWeight: "bold" }}>
                  Solicitação
                </Typography>
                <CheckCircleOutlineOutlinedIcon
                  sx={{
                    color: title && description ? "#50C878" : "lightgrey",
                    ml: 1,
                  }}
                />
              </Grid>
              <Grid container sx={{ mt: 2 }} direction="column">
                <Grid item>
                  <TextField
                    label="Título"
                    size="small"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 2 }}
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
            </Grid>
          )}
        </DialogContent>

        <DialogActions>
          <Button type="submit" variant="contained" color="success">
            OK
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => setOpenEditJob(!openEditJob)}
          >
            X
          </Button>
        </DialogActions>
      </>
    </form>
  );
};

export default EditJobForm;
