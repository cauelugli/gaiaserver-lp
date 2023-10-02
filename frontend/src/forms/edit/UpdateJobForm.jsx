/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import axios from "axios";
import dayjs from "dayjs";

import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  // Paper,
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

const UpdateJobForm = ({
  openUpdateJob,
  setOpenUpdateJob,
  fetchData1,
  selectedJob,
  toast,
}) => {
  const [expand, setExpand] = React.useState(false);
  const [newInteration, setNewInteration] = React.useState(false);
  const [activity, setActivity] = React.useState(false);
  const [status, setStatus] = React.useState(selectedJob.status);

  // const [title, setTitle] = React.useState(selectedJob.title);
  // const [description, setDescription] = React.useState(selectedJob.description);
  // const [requester, setRequester] = React.useState(selectedJob.requester);
  // const [worker, setWorker] = React.useState(selectedJob.worker);
  // const [department, setDepartment] = React.useState(selectedJob.department);
  // const [service, setService] = React.useState("");
  // const [price, setPrice] = React.useState(selectedJob.price);
  // const [materials, setMaterials] = React.useState(selectedJob.materials);
  // const [materialsCost, setMaterialsCost] = React.useState(
  //   selectedJob.materialsCost
  // );
  // const [local, setLocal] = React.useState(selectedJob.local);
  const [scheduledTo, setScheduledTo] = React.useState(
    dayjs(selectedJob.scheduledTo)
  );

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/jobs", {
        jobId: selectedJob._id,
        status,
        activity,
      });
      if (res.data) {
        toast.success("Pedido Atualizado!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
      setOpenUpdateJob(!openUpdateJob);
      fetchData1;
    } catch (err) {
      alert("Vish, deu não...");
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleUpdate}>
      <Grid container sx={{ mt: 3 }}>
        <DialogTitle>Atualizando Job</DialogTitle>
      </Grid>

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
              value={selectedJob.customer.cnpj ? "Empresa" : "Pessoa Física"}
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
                      {selectedJob.service && `${selectedJob.service.name} = `}
                      {selectedJob.service.value
                        ? `R$ ${selectedJob.service.value}`
                        : "R$0,00"}
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
                      Serviço + Materiais = R$
                      {selectedJob.materialsCost + selectedJob.service.value}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </>
        )}

        <div style={{ marginTop: "50px", marginBottom: "50px" }}>
          <div
            id="here"
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

        <Typography sx={{ mb: 1, fontSize: 18, fontWeight: "bold" }}>
          Interações
        </Typography>
        <Table>
          <TableBody>
            <TableRow
              sx={{
                backgroundColor: "#ccc",
              }}
            >
              <TableCell>
                <Typography sx={{ fontSize: 14, fontWeight: "bold" }}>
                  Data
                </Typography>
              </TableCell>
              <TableCell align="left">
                <Typography sx={{ fontSize: 14, fontWeight: "bold" }}>
                  Colaborador
                </Typography>
              </TableCell>
              <TableCell align="left">
                <Typography sx={{ fontSize: 14, fontWeight: "bold" }}>
                  Atividade
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography sx={{ fontSize: 12 }}>
                  10/04/2020 11:23AM
                </Typography>
              </TableCell>
              <TableCell align="left">
                <Typography sx={{ fontSize: 12 }}>Zé da Manga</Typography>
              </TableCell>
              <TableCell align="left">
                <Typography sx={{ fontSize: 12 }}>
                  Fiz o trampo como deveria ter sido feito, sem novidade.
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {newInteration ? (
          <>
            <Typography sx={{ mb: 2, mt: 4, fontSize: 18, fontWeight: "bold" }}>
              Nova Interação
            </Typography>
            <Select
              onChange={(e) => setStatus(e.target.value)}
              value={status}
              size="small"
              sx={{ width: "19%", mr: 1 }}
            >
              <MenuItem value={"Aberto"}>Aberto</MenuItem>
              <MenuItem value={"Aguardando Execução"}>
                Aguardando Execução
              </MenuItem>
              <MenuItem value={"Em Execução"}>Em Execução</MenuItem>
              <MenuItem value={"Aguardando Cliente"}>
                Aguardando Cliente
              </MenuItem>
              <MenuItem value={"Aguardando Terceiro"}>
                Aguardando Terceiro
              </MenuItem>
              <MenuItem value={"Concluido"}>Concluido</MenuItem>
            </Select>
            <TextField
              label="Atividade"
              variant="outlined"
              size="small"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              sx={{ width: "80%" }}
            />
          </>
        ) : (
          <Button
            size="large"
            variant="contained"
            color="success"
            onClick={() => setNewInteration(!newInteration)}
            sx={{ mt: 2 }}
          >
            + Nova Interação
          </Button>
        )}
      </DialogContent>

      <DialogActions sx={{ pr: "4%" }}>
        {newInteration ? (
          <>
            <Button variant="contained" color="success" onClick={""}>
              Enviar
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => setNewInteration(!newInteration)}
            >
              Cancelar Interação
            </Button>
          </>
        ) : (
          <Button
            variant="contained"
            color="error"
            onClick={() => setOpenUpdateJob(!openUpdateJob)}
          >
            X
          </Button>
        )}
      </DialogActions>
    </form>
  );
};

export default UpdateJobForm;
