/* eslint-disable react/prop-types */
import * as React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Dialog,
  Box,
  Collapse,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Grid,
  Avatar,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

import EditJobForm from "../forms/edit/EditJobForm";
import DeleteJobForm from "../forms/delete/DeleteJobForm";
import dayjs from "dayjs";
import UpdateJobForm from "../forms/edit/UpdateJobForm";

export default function JobTable({ jobs, fetchData }) {
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openDetail, setOpenDetail] = React.useState(false);
  const [openUpdate, setOpenUpdate] = React.useState(false);
  const [selectedJob, setSelectedJob] = React.useState([]);
  console.log("jobs", jobs);

  const handleOpenDetail = (job) => {
    setOpenDetail(!openDetail);
    setSelectedJob(job);
  };

  const handleOpenEdit = (job) => {
    setOpenEdit(!openEdit);
    setSelectedJob(job);
  };

  const handleConfirmDelete = (job) => {
    setSelectedJob(job);
    setOpenDelete(!openDelete);
  };

  const handleOpenUpdate = (job) => {
    setOpenUpdate(!openUpdate);
    setSelectedJob(job);
  };

  return (
    <Box sx={{ minWidth: "1050px" }}>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow
              sx={{
                backgroundColor: "#ccc",
              }}
            >
              <TableCell align="left">
                <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                  Nome do Job
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                  Solicitante
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                  Serviço
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                  Agendado para
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                  Status
                </Typography>
              </TableCell>
            </TableRow>
            {jobs.map((job) => (
              <>
                <TableRow
                  key={job._id}
                  sx={{
                    cursor: "pointer",
                    backgroundColor:
                      selectedJob.title === job.title && openDetail
                        ? "#eee"
                        : "none",
                    "&:hover": { backgroundColor: "#eee " },
                  }}
                >
                  <TableCell
                    onClick={() => handleOpenDetail(job)}
                    cursor="pointer"
                    align="left"
                  >
                    <Typography sx={{ fontSize: 14 }}>{job.title}</Typography>
                  </TableCell>
                  <TableCell
                    onClick={() => handleOpenDetail(job)}
                    cursor="pointer"
                    align="center"
                  >
                    <Typography sx={{ fontSize: 14 }}>
                      {job.requester}
                      {job.customer.cnpj && `(${job.customer.name})`}
                    </Typography>
                  </TableCell>
                  <TableCell
                    onClick={() => handleOpenDetail(job)}
                    cursor="pointer"
                    align="center"
                  >
                    <Typography sx={{ fontSize: 14 }}>
                      {job.service.name}
                    </Typography>
                  </TableCell>
                  <TableCell
                    onClick={() => handleOpenDetail(job)}
                    cursor="pointer"
                    align="center"
                  >
                    <Typography sx={{ fontSize: 14 }}>
                      {dayjs(job.scheduledTo).format("DD/MM/YYYY")}
                    </Typography>
                  </TableCell>
                  <TableCell
                    onMouseEnter={() => setSelectedJob(job._id)}
                    onMouseLeave={() => setSelectedJob("")}
                    align="center"
                    sx={{ p: 0 }}
                  >
                    {selectedJob === job._id ? (
                      <Button
                        variant="outlined"
                        color="inherit"
                        size="small"
                        sx={{ p: 0.5 }}
                        onClick={() => handleOpenUpdate(job)}
                      >
                        Alterar
                      </Button>
                    ) : (
                      <Typography
                        sx={{
                          fontSize: 14,
                          color:
                            (job.status === "Aberto" && "#E1AD01") ||
                            (job.status === "Em Andamento" && "") ||
                            (job.status === "Feito" && "#006400"),
                        }}
                      >
                        {job.status}
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={6}
                  >
                    <Collapse
                      in={openDetail && selectedJob.title === job.title}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Box sx={{ my: 4, px: 6 }}>
                        <Typography
                          variant="h6"
                          sx={{ fontSize: 18, fontWeight: "bold" }}
                        >
                          Geral
                        </Typography>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>
                                <Typography
                                  sx={{ fontSize: "14px", color: "#777" }}
                                >
                                  Título do Job
                                </Typography>
                              </TableCell>
                              <TableCell align="left">
                                <Typography
                                  sx={{ fontSize: "14px", color: "#777" }}
                                >
                                  Solicitante
                                </Typography>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell align="left">
                                <Typography>{job.title}</Typography>
                              </TableCell>
                              <TableCell align="left">
                                <Typography>
                                  {job.requester}
                                  {job.customer.cnpj &&
                                    `(${job.customer.name})`}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </Box>
                      <Box sx={{ my: 4, px: 6 }}>
                        <Typography
                          variant="h6"
                          sx={{ fontSize: 18, fontWeight: "bold" }}
                        >
                          Descrição
                        </Typography>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>
                                <Typography
                                  sx={{ fontSize: "14px", color: "#777" }}
                                >
                                  Sobre
                                </Typography>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell align="left">
                                <Typography>{job.description}</Typography>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </Box>

                      <Box sx={{ my: 4, px: 6 }}>
                        <Typography
                          variant="h6"
                          sx={{ fontSize: 18, fontWeight: "bold" }}
                        >
                          Departamento
                        </Typography>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell align="left">
                                <Typography
                                  sx={{ fontSize: "14px", color: "#777" }}
                                >
                                  Nome do Departamento
                                </Typography>
                              </TableCell>
                              <TableCell align="left">
                                <Typography
                                  sx={{ fontSize: "14px", color: "#777" }}
                                >
                                  Gerente Responsável
                                </Typography>
                              </TableCell>
                              <TableCell align="left">
                                <Typography
                                  sx={{ fontSize: "14px", color: "#777" }}
                                >
                                  Colaborador Designado
                                </Typography>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell align="left">
                                <Typography>{job.department.name}</Typography>
                              </TableCell>
                              <TableCell align="left">
                                <Typography>{job.manager.name}</Typography>
                              </TableCell>
                              <TableCell align="left">
                                <Grid container direction="row">
                                  <Grid item>
                                    <Avatar
                                      alt="Imagem do Colaborador"
                                      src={`http://localhost:3000/static/${job.worker.image}`}
                                      sx={{ width: 22, height: 22, mr: 1 }}
                                    />
                                  </Grid>
                                  <Grid item>
                                    <Typography>{job.worker.name}</Typography>
                                  </Grid>
                                </Grid>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </Box>
                      <Box sx={{ my: 4, px: 6 }}>
                        <Typography
                          variant="h6"
                          sx={{ fontSize: 18, fontWeight: "bold" }}
                        >
                          Orçamento
                        </Typography>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>
                                <Typography
                                  sx={{ fontSize: "14px", color: "#777" }}
                                >
                                  Nº do Orçamento
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  sx={{ fontSize: "14px", color: "#777" }}
                                >
                                  Serviço
                                </Typography>
                              </TableCell>
                              <TableCell align="left">
                                <Typography
                                  sx={{ fontSize: "14px", color: "#777" }}
                                >
                                  Materiais
                                </Typography>
                              </TableCell>
                              <TableCell align="left">
                                <Typography
                                  sx={{ fontSize: "14px", color: "#777" }}
                                >
                                  Valor Total (serviço + materiais)
                                </Typography>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell component="th" scope="row">
                                <Typography>{job.quoteNumber}</Typography>
                              </TableCell>
                              <TableCell align="left">
                                <Typography>{job.service.name}</Typography>
                              </TableCell>
                              <TableCell align="left">
                                <Typography>
                                  {job.materials.length > 0
                                    ? job.materials.map((material) => (
                                        <Typography key={material.id}>
                                          x{material.quantity} {material.name}
                                        </Typography>
                                      ))
                                    : "Não há uso de Materiais"}
                                </Typography>
                              </TableCell>
                              <TableCell align="left">
                                <Typography>R${job.price}</Typography>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                        <Box sx={{ mt: 3, ml: "90%" }}>
                          <ModeEditIcon
                            cursor="pointer"
                            onClick={() => handleOpenEdit(job)}
                            sx={{ color: "grey", mr: 2 }}
                          />
                          <DeleteIcon
                            cursor="pointer"
                            onClick={() => handleConfirmDelete(job)}
                            sx={{ color: "#ff4444" }}
                          />
                        </Box>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {openEdit && (
        <Dialog
          fullWidth
          maxWidth="lg"
          open={openEdit}
          onClose={() => setOpenEdit(!openEdit)}
        >
          <EditJobForm
            openEditJob={openEdit}
            selectedJob={selectedJob}
            setOpenEditJob={setOpenEdit}
            fetchData={fetchData}
            toast={toast}
          />
        </Dialog>
      )}
      {openDelete && (
        <Dialog open={openDelete} onClose={() => setOpenDelete(!openDelete)}>
          <DeleteJobForm
            selectedJob={selectedJob}
            openDelete={openDelete}
            setOpenDelete={setOpenDelete}
            fetchData={fetchData}
            toast={toast}
          />
        </Dialog>
      )}
      {openUpdate && (
        <Dialog
          fullWidth
          maxWidth="lg"
          open={openUpdate}
          onClose={() => setOpenUpdate(!openUpdate)}
        >
          <UpdateJobForm
            openUpdateJob={openUpdate}
            selectedJob={selectedJob}
            setOpenUpdateJob={setOpenUpdate}
            fetchData={fetchData}
            toast={toast}
          />
        </Dialog>
      )}
    </Box>
  );
}
