/* eslint-disable react/prop-types */
import * as React from "react";

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
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

import EditJobForm from "../forms/edit/EditJobForm";
import DeleteJobForm from "../forms/delete/DeleteJobForm";

export default function JobTable({ jobs, fetchData }) {
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openDetail, setOpenDetail] = React.useState(false);
  const [selectedJob, setSelectedJob] = React.useState([]);

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

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: "100%" }}>
          <TableBody>
            <TableRow
              sx={{
                backgroundColor: "#ccc",
              }}
            >
              <TableCell align="left">
                <Typography>Nome do Job</Typography>
              </TableCell>
              <TableCell align="left">
                <Typography>Solicitante</Typography>
              </TableCell>
              <TableCell align="left">
                <Typography>Serviço</Typography>
              </TableCell>
              <TableCell align="left">
                <Typography>Status</Typography>
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
                        ? "#95dd95"
                        : "none",
                    "&:hover": { backgroundColor: "#ccc " },
                  }}
                >
                  <TableCell
                    onClick={() => handleOpenDetail(job)}
                    cursor="pointer"
                    align="left"
                  >
                    <Typography>{job.title}</Typography>
                  </TableCell>
                  <TableCell
                    onClick={() => handleOpenDetail(job)}
                    cursor="pointer"
                    align="left"
                  >
                    <Typography>
                      {job.requester} ({job.customer.name})
                    </Typography>
                  </TableCell>
                  <TableCell
                    onClick={() => handleOpenDetail(job)}
                    cursor="pointer"
                    align="left"
                  >
                    <Typography>{job.service.name}</Typography>
                  </TableCell>
                  <TableCell
                    onClick={() => handleOpenDetail(job)}
                    cursor="pointer"
                    align="left"
                  >
                    <Typography>{job.status}</Typography>
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
                        <Typography variant="h6">Geral</Typography>
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
                                  {job.requester} ({job.customer.name})
                                </Typography>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </Box>
                      <Box sx={{ my: 4, px: 6 }}>
                        <Typography variant="h6">Departamento</Typography>
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
                                  Gerente
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
                                <Typography>{job.worker.name}</Typography>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </Box>
                      <Box sx={{ my: 4, px: 6 }}>
                        <Typography variant="h6">Orçamento</Typography>
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
                                  Tipo de Serviço
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
                                  Valor Total
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
                                <Typography>
                                  {job.service.name}
                                </Typography>
                              </TableCell>
                              <TableCell align="left">
                                <Typography>{job.service.materials.length > 0 ? job.service.material : "Não há uso de Materiais"}</Typography>
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
          />
        </Dialog>
      )}
    </Box>
  );
}
