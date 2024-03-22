/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import dayjs from "dayjs";

import {
  Avatar,
  Box,
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormLabel,
  Grid,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableRow,
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

const EditJobForm = ({
  user,
  option,
  openEditJob,
  setOpenEditJob,
  selectedJob,
  refreshData,
  setRefreshData,
  toast,
}) => {
  const [title, setTitle] = React.useState(selectedJob.title);
  const [description, setDescription] = React.useState(selectedJob.description);
  const [requester, setRequester] = React.useState(selectedJob.requester);
  const [worker, setWorker] = React.useState(selectedJob.worker);
  const [department, setDepartment] = React.useState(selectedJob.department);
  const [status, setStatus] = React.useState(selectedJob.status);
  const [service, setService] = React.useState("");
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

  const [expand, setExpand] = React.useState(false);
  const [activity, setActivity] = React.useState("");

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const departmentsResponse = await api.get("/departments");
        const servicesResponse = await api.get("/services");

        // Organizar os membros nos serviços correspondentes
        const modifiedDepartments = departmentsResponse.data.map(
          (department) => {
            const departmentServices = servicesResponse.data.filter(
              (service) => service.department._id === department._id
            );

            const updatedDepartment = {
              ...department,
              services: departmentServices.map((service) => {
                const serviceMembers = department.members.filter((member) =>
                  service.members.includes(member._id)
                );

                return {
                  ...service,
                  members: serviceMembers,
                };
              }),
            };

            return updatedDepartment;
          }
        );

        setDepartments(
          modifiedDepartments.filter(
            (department) => department.type === "Serviços"
          )
        );
        setServices(servicesResponse.data);

        const selectedDepartment = modifiedDepartments.find(
          (department) => department._id === selectedJob.department.id
        );
        setDepartment(selectedDepartment);

        const selectedService = servicesResponse.data.find(
          (service) => service._id === selectedJob.service._id
        );
        setService(selectedService);
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

  const handleEdit = async (e) => {
    e.preventDefault();

    if (option === "interaction") {
      const requestBody = {
        jobId: selectedJob._id,
        option: "interaction",
        number: selectedJob.interactions.length + 1,
        activity,
        status,
        user,
        worker: selectedJob.worker,
        manager: selectedJob.manager,
        date: new Date().toLocaleDateString("pt-BR").replace(/\//g, "-"),
      };
      try {
        const res = await api.put("/jobs", requestBody);
        if (res.data) {
          toast.success(
            option === "interaction"
              ? "Interação Adicionada!"
              : "Solicitação Editada!",

            {
              closeOnClick: true,
              pauseOnHover: false,
              theme: "colored",
              autoClose: 1200,
            }
          );
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
    } 
    // else if (option === "resolve") {
    //   const requestBody = {
    //     jobId: selectedJob._id,
    //     option: "resolve",
    //     activity,
    //     user,
    //     worker: selectedJob.worker,
    //     manager: selectedJob.manager,
    //     date: new Date().toLocaleDateString("pt-BR").replace(/\//g, "-"),
    //   };
    //   try {
    //     const res = await api.put("/jobs", requestBody);
    //     if (res.data) {
    //       toast.success("Job Resolvido", {
    //         closeOnClick: true,
    //         pauseOnHover: false,
    //         theme: "colored",
    //         autoClose: 1200,
    //       });
    //     }
    //     setOpenEditJob(!openEditJob);
    //     setRefreshData(!refreshData);
    //   } catch (err) {
    //     toast.error("Houve algum erro...", {
    //       closeOnClick: true,
    //       pauseOnHover: false,
    //       theme: "colored",
    //       autoClose: 1200,
    //     });
    //     console.log(err);
    //   }
    // } 
    else {
      const requestBody = {
        jobId: selectedJob._id,
        option: "edit",
        title,
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
        const res = await api.put("/jobs", requestBody);

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
    }
  };

  return (
    <form onSubmit={handleEdit}>
      <Grid container sx={{ mt: 3 }}>
        <DialogTitle>
          {option === "interaction"
            ? "Nova Interação"
            : option === "resolve"
            ? "Resolvendo Job"
            : "Editando Job"}
        </DialogTitle>
      </Grid>
      {option === "interaction" && (
        <>
          <DialogContent>
            <Typography sx={{ mb: 1, fontSize: 18, fontWeight: "bold" }}>
              Informações do Job
            </Typography>
            <Grid
              container
              sx={{ mt: 2 }}
              direction="row"
              justifyContent="flex-start"
              alignItems="flex-start"
            >
              <Grid item>
                <TextField
                  label="Tipo"
                  variant="outlined"
                  disabled
                  value={
                    selectedJob.customer.cnpj ? "Empresa" : "Pessoa Física"
                  }
                  sx={{ width: 180 }}
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Cliente"
                  variant="outlined"
                  disabled
                  value={selectedJob.customer.name}
                  sx={{ width: 200, ml: 1 }}
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Solicitante"
                  value={selectedJob.requester}
                  disabled
                  variant="outlined"
                  sx={{ width: 200, mx: 1 }}
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Local de Execução"
                  value={selectedJob.local}
                  disabled
                  variant="outlined"
                  sx={{ width: 250, mr: 1 }}
                />
              </Grid>
              <Grid item sx={{ mt: -1 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DatePicker"]}>
                    <DatePicker
                      value={scheduledTo}
                      disabled
                      format="DD/MM/YYYY"
                      onChange={(newValue) => setScheduledTo(newValue)}
                      label="Agendado para"
                      sx={{ width: 180 }}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </Grid>
            </Grid>

            {expand && (
              <>
                <Typography sx={{ my: 2, fontSize: 18, fontWeight: "bold" }}>
                  Departamento
                </Typography>
                <Grid
                  container
                  direction="row"
                  alignItems="flex-start"
                  justifyContent="space-evenly"
                >
                  <Grid item>
                    <TextField
                      label="Departamento"
                      value={selectedJob.department.name}
                      disabled
                      variant="outlined"
                      sx={{ width: 200 }}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      label="Serviço"
                      value={selectedJob.service.name}
                      disabled
                      variant="outlined"
                      sx={{ width: 200, mx: -10 }}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      label="Colaborador"
                      value={selectedJob.worker.name}
                      disabled
                      variant="outlined"
                      sx={{ width: 200 }}
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />
                <Typography sx={{ my: 1, fontSize: 18, fontWeight: "bold" }}>
                  Solicitação
                </Typography>
                <Grid container sx={{ mt: 2 }} direction="column">
                  <Grid item>
                    <TextField
                      label="Título"
                      size="small"
                      value={selectedJob.title}
                      disabled
                      variant="outlined"
                      fullWidth
                      sx={{ mb: 2 }}
                    />

                    <TextField
                      label="Descrição"
                      value={selectedJob.description}
                      disabled
                      variant="outlined"
                      fullWidth
                      sx={{ mb: 1 }}
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />
                <Typography sx={{ my: 2, fontSize: 18, fontWeight: "bold" }}>
                  Orçamento
                </Typography>
                <Grid container sx={{ ml: "5%" }} direction="row">
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
                          {selectedJob.service &&
                            `${selectedJob.service.name} = `}
                          {selectedJob.service.value
                            ? `R$ ${selectedJob.service.value}`
                            : "R$0,00"}
                        </Typography>
                      </Grid>
                      <Typography
                        sx={{ fontSize: 16, mt: 2, fontWeight: "bold" }}
                      >
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
                          {selectedJob.materials.map((material) => (
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
                      <Typography
                        sx={{ fontSize: 16, mt: 2, fontWeight: "bold" }}
                      >
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
                          Serviço + Materiais = R$
                          {selectedJob.materialsCost +
                            selectedJob.service.value}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </>
            )}

            <div style={{ marginTop: "50px", marginBottom: "50px" }}>
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button
                  variant="contained"
                  color="inherit"
                  onClick={() => setExpand(!expand)}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 1,
                  }}
                >
                  {expand ? "Clique para Recolher" : "Clique para Expandir"}
                </Button>
                <Divider
                  sx={{
                    position: "absolute",
                    width: "100%",
                    top: "50%",
                    zIndex: 0,
                  }}
                />
              </div>
            </div>

            <>
              <Typography
                sx={{ mb: 2, mt: 4, fontSize: 18, fontWeight: "bold" }}
              >
                Nova Interação
              </Typography>
              <FormLabel>Status</FormLabel>
              <Select
                onChange={(e) => setStatus(e.target.value)}
                value={status}
                size="small"
                sx={{ width: "20%", ml: 1 }}
              >
                <MenuItem disabled>Aberto</MenuItem>
                <MenuItem value={"Em Execução"}>Em Execução</MenuItem>
                <MenuItem value={"Aguardando Cliente"}>
                  Aguardando Cliente
                </MenuItem>
                <MenuItem value={"Aguardando Terceiro"}>
                  Aguardando Terceiro
                </MenuItem>
              </Select>
              <TextField
                label="Atividade"
                variant="outlined"
                size="small"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                sx={{ width: "62%", mx: 1 }}
              />
              <Button type="submit" variant="contained" color="success">
                Adicionar
              </Button>
            </>

            <Typography sx={{ mt: 3, mb: 1, fontSize: 18, fontWeight: "bold" }}>
              Interações
            </Typography>
            <Table>
              <TableBody>
                <TableRow
                  sx={{
                    backgroundColor: "#eee",
                  }}
                >
                  <TableCell>
                    <Typography sx={{ fontSize: 13, fontWeight: "bold" }}>
                      #
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography sx={{ fontSize: 13, fontWeight: "bold" }}>
                      Data
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography sx={{ fontSize: 13, fontWeight: "bold" }}>
                      Colaborador
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography sx={{ fontSize: 13, fontWeight: "bold" }}>
                      Atividade
                    </Typography>
                  </TableCell>
                </TableRow>

                {selectedJob.interactions.map((interaction) => (
                  <TableRow
                    key={interaction.number}
                    sx={{
                      backgroundColor:
                        interaction.number % 2 === 0 ? "#eee" : "white",
                    }}
                  >
                    <TableCell>
                      <Typography sx={{ fontSize: 12 }}>
                        {interaction.number}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography sx={{ fontSize: 12 }}>
                        {interaction.date}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography sx={{ fontSize: 12 }}>
                        {interaction.user}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography sx={{ fontSize: 12 }}>
                        {interaction.activity}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DialogContent>

          <DialogActions>
            <Button
              variant="contained"
              color="error"
              onClick={() => setOpenEditJob(!openEditJob)}
            >
              X
            </Button>
          </DialogActions>
        </>
      )}
      {/* {option === "resolve" && (
        <>
          <DialogContent>
            <Typography sx={{ mb: 1, fontSize: 18, fontWeight: "bold" }}>
              Informações do Job
            </Typography>
            <Grid
              container
              sx={{ mt: 2 }}
              direction="row"
              justifyContent="flex-start"
              alignItems="flex-start"
            >
              <Grid item>
                <TextField
                  label="Tipo"
                  variant="outlined"
                  disabled
                  value={
                    selectedJob.customer.cnpj ? "Empresa" : "Pessoa Física"
                  }
                  sx={{ width: 180 }}
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Cliente"
                  variant="outlined"
                  disabled
                  value={selectedJob.customer.name}
                  sx={{ width: 200, ml: 1 }}
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Solicitante"
                  value={selectedJob.requester}
                  disabled
                  variant="outlined"
                  sx={{ width: 200, mx: 1 }}
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Local de Execução"
                  value={selectedJob.local}
                  disabled
                  variant="outlined"
                  sx={{ width: 250, mr: 1 }}
                />
              </Grid>
              <Grid item sx={{ mt: -1 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DatePicker"]}>
                    <DatePicker
                      value={scheduledTo}
                      disabled
                      format="DD/MM/YYYY"
                      onChange={(newValue) => setScheduledTo(newValue)}
                      label="Agendado para"
                      sx={{ width: 180 }}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </Grid>
            </Grid>

            {expand && (
              <>
                <Typography sx={{ my: 2, fontSize: 18, fontWeight: "bold" }}>
                  Departamento
                </Typography>
                <Grid
                  container
                  direction="row"
                  alignItems="flex-start"
                  justifyContent="space-evenly"
                >
                  <Grid item>
                    <TextField
                      label="Departamento"
                      value={selectedJob.department.name}
                      disabled
                      variant="outlined"
                      sx={{ width: 200 }}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      label="Serviço"
                      value={selectedJob.service.name}
                      disabled
                      variant="outlined"
                      sx={{ width: 200, mx: -10 }}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      label="Colaborador"
                      value={selectedJob.worker.name}
                      disabled
                      variant="outlined"
                      sx={{ width: 200 }}
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />
                <Typography sx={{ my: 1, fontSize: 18, fontWeight: "bold" }}>
                  Solicitação
                </Typography>
                <Grid container sx={{ mt: 2 }} direction="column">
                  <Grid item>
                    <TextField
                      label="Título"
                      size="small"
                      value={selectedJob.title}
                      disabled
                      variant="outlined"
                      fullWidth
                      sx={{ mb: 2 }}
                    />

                    <TextField
                      label="Descrição"
                      value={selectedJob.description}
                      disabled
                      variant="outlined"
                      fullWidth
                      sx={{ mb: 1 }}
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />
                <Typography sx={{ my: 2, fontSize: 18, fontWeight: "bold" }}>
                  Orçamento
                </Typography>
                <Grid container sx={{ ml: "5%" }} direction="row">
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
                          {selectedJob.service &&
                            `${selectedJob.service.name} = `}
                          {selectedJob.service.value
                            ? `R$ ${selectedJob.service.value}`
                            : "R$0,00"}
                        </Typography>
                      </Grid>
                      <Typography
                        sx={{ fontSize: 16, mt: 2, fontWeight: "bold" }}
                      >
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
                          {selectedJob.materials.map((material) => (
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
                      <Typography
                        sx={{ fontSize: 16, mt: 2, fontWeight: "bold" }}
                      >
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
                          Serviço + Materiais = R$
                          {selectedJob.materialsCost +
                            selectedJob.service.value}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </>
            )}

            <div style={{ marginTop: "50px", marginBottom: "50px" }}>
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button
                  variant="contained"
                  color="inherit"
                  onClick={() => setExpand(!expand)}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 1,
                  }}
                >
                  {expand ? "Clique para Recolher" : "Clique para Expandir"}
                </Button>
                <Divider
                  sx={{
                    position: "absolute",
                    width: "100%",
                    top: "50%",
                    zIndex: 0,
                  }}
                />
              </div>
            </div>

            <>
              <Typography
                sx={{ mb: 2, mt: 4, fontSize: 18, fontWeight: "bold" }}
              >
                Resolução
              </Typography>
              <TextField
                value={"Status: Concluido"}
                size="small"
                disabled
                sx={{ width: "20%", ml: 1 }}
              />
              <TextField
                label="Atividade"
                variant="outlined"
                size="small"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                sx={{ width: "62%", mx: 1 }}
              />
              <Button type="submit" variant="contained" color="success">
                Resolver
              </Button>
            </>
          </DialogContent>

          <DialogActions>
            <Button
              variant="contained"
              color="error"
              onClick={() => setOpenEditJob(!openEditJob)}
            >
              X
            </Button>
          </DialogActions>
        </>
      )} */}
      {option === "edit" && (
        <>
          <DialogContent>
            <Typography sx={{ mb: 1, fontSize: 18, fontWeight: "bold" }}>
              Informações do Cliente
            </Typography>
            <Grid
              container
              sx={{ pr: "4%", mt: 2 }}
              direction="row"
              justifyContent="flex-start"
              alignItems="flex-start"
            >
              <Grid item>
                <TextField
                  label="Tipo"
                  variant="outlined"
                  disabled={option === "interaction"}
                  value={
                    selectedJob.customer.cnpj ? "Empresa" : "Pessoa Física"
                  }
                  sx={{ width: 180 }}
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Cliente"
                  variant="outlined"
                  value={selectedJob.customer.name}
                  sx={{ width: 200, mx: 1 }}
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Solicitante"
                  value={requester}
                  onChange={(e) => setRequester(e.target.value)}
                  variant="outlined"
                  sx={{ width: 200, ml: 1 }}
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Local de Execução"
                  value={local}
                  onChange={(e) => setLocal(e.target.value)}
                  variant="outlined"
                  sx={{ width: 250, mx: 1 }}
                />
              </Grid>
              <Grid item sx={{ mt: -1 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DatePicker"]}>
                    <DatePicker
                      value={scheduledTo}
                      format="DD/MM/YYYY"
                      onChange={(newValue) => setScheduledTo(newValue)}
                      label="Agendado para"
                      sx={{ width: 180 }}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </Grid>
            </Grid>

            <Divider sx={{ mt: 2 }} />
            <Typography sx={{ my: 3, fontSize: 18, fontWeight: "bold" }}>
              Departamento
            </Typography>
            <Grid
              container
              direction="row"
              alignItems="flex-start"
              justifyContent="space-evenly"
            >
              <Grid item>
                <Select
                  onChange={(e) => {
                    setDepartment(e.target.value),
                      setService(""),
                      setWorker("");
                  }}
                  value={department || selectedJob.department}
                  size="small"
                  sx={{ minWidth: "200px" }}
                  renderValue={(selected) => (
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
                  )}
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
              <Grid item sx={{ mx: -10, mt: -7 }}>
                <>
                  <Typography sx={{ my: 2 }}>Serviço</Typography>
                  <Select
                    onChange={(e) => setService(e.target.value)}
                    value={service}
                    size="small"
                    sx={{ width: 250 }}
                    renderValue={(selected) => {
                      if (selected.length === 0) {
                        return (
                          <Typography>{selectedJob.service.name}</Typography>
                        );
                      }

                      return selected.name;
                    }}
                  >
                    {services
                      .filter(
                        (service) =>
                          service.department.id ===
                          (department
                            ? department._id
                            : selectedJob.department.id)
                      )
                      .map((item) => (
                        <MenuItem value={item} key={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                  </Select>
                </>
              </Grid>
              <Grid item sx={{ mt: -7 }}>
                <>
                  <Typography sx={{ my: 2 }}>Colaborador</Typography>
                  <Select
                    onChange={(e) => setWorker(e.target.value)}
                    value={worker}
                    size="small"
                    displayEmpty
                    required
                    renderValue={(selected) => {
                      if (selected.length === 0) {
                        return <Typography>Selecione o Colaborador</Typography>;
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
                    {department.members &&
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
                </>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />
            <Typography sx={{ my: 1, fontSize: 18, fontWeight: "bold" }}>
              Solicitação
            </Typography>
            <Grid container sx={{ mt: 2 }} direction="column">
              <Grid item>
                <TextField
                  label="Título"
                  size="small"
                  value={title}
                  disabled={option === "interaction"}
                  onChange={(e) => setTitle(e.target.value)}
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 2 }}
                />

                <TextField
                  label="Descrição"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={option === "interaction"}
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 1 }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />
            <Typography sx={{ my: 2, fontSize: 18, fontWeight: "bold" }}>
              Orçamento
            </Typography>
            <Grid container sx={{ pr: "4%", ml: "5%" }} direction="row">
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
                    {service && (
                      <Typography sx={{ fontSize: 16, mx: 1 }}>
                        {service && `${service.name} = `}{" "}
                        {service.value ? `R$ ${service.value}` : "R$0,00"}
                      </Typography>
                    )}
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
              </Grid>
            </Grid>

            <Divider sx={{ my: 3, mt: 4 }} />
            <Checkbox
              checked={showAdditionalOptions}
              onChange={handleCheckboxChange}
            />
            <label>Observações</label>

            {showAdditionalOptions && (
              <Box>
                <Divider sx={{ my: 3 }} />
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
              onClick={() => setOpenEditJob(!openEditJob)}
            >
              X
            </Button>
          </DialogActions>
        </>
      )}
    </form>
  );
};

export default EditJobForm;
