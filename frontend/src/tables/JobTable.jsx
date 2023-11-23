/* eslint-disable react/prop-types */
import * as React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";
import axios from "axios";

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
  Grid,
  Avatar,
  TableSortLabel,
  TablePagination,
} from "@mui/material";

import InteractionReactions from "../components/small/InteractionReactions";

import EditJobForm from "../forms/edit/EditJobForm";
import GenericDeleteForm from "../forms/delete/GenericDeleteForm";
import RequestActions from "../components/small/RequestActions";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function JobTable({
  user,
  searchValue,
  searchStatus,
  searchOption,
  jobs,
  managers,
  refreshData,
  setRefreshData,
}) {
  const [userReactions, setUserReactions] = React.useState({});
  const [openEdit, setOpenEdit] = React.useState(false);
  const [option, setOption] = React.useState("interaction");
  const [openDetail, setOpenDetail] = React.useState(false);
  const [selectedJob, setSelectedJob] = React.useState([]);
  const [selectedItem, setSelectedItem] = React.useState("");
  const [openDialog, setOpenDialog] = React.useState(false);

  const handleConfirmDelete = (position) => {
    setSelectedItem(position);
    setOpenDialog(true);
  };

  const handleOpenDetail = (job) => {
    setOpenDetail(!openDetail);
    setSelectedJob(job);
  };

  const handleOpenEdit = (job, option) => {
    setOpenEdit(!openEdit);
    setOption(option);
    setSelectedJob(job);
  };

  const tableHeaderRow = [
    {
      id: "title",
      label: "Título",
    },
    {
      id: "requester",
      label: "Solicitante",
    },
    {
      id: "createdBy",
      label: "Criado por",
    },
    {
      id: "worker",
      label: "Designado",
    },
    {
      id: "scheduledTo",
      label: "Agendado para",
    },
    {
      id: "status",
      label: "Status",
    },
  ];

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("scheduledTo");

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedRows = React.useMemo(() => {
    const compare = (a, b) => {
      const departmentA = a.department ? a.department.name : "";
      const departmentB = b.department ? b.department.name : "";

      if (order === "asc") {
        return departmentA.localeCompare(departmentB);
      } else {
        return departmentB.localeCompare(departmentA);
      }
    };

    if (orderBy === "department.name") {
      return [...jobs].sort(compare);
    }

    return [...jobs].sort((a, b) => {
      const isAsc = order === "asc";
      if (isAsc) {
        return a[orderBy] < b[orderBy] ? -1 : 1;
      } else {
        return b[orderBy] < a[orderBy] ? -1 : 1;
      }
    });
  }, [jobs, order, orderBy]);

  const handleManagerApproval = async (job) => {
    try {
      const requestBody = {
        jobId: job._id,
        option: "managerApproval",
        status: "Aprovado",
        user: user.name,
        date: new Date().toLocaleDateString("pt-BR").replace(/\//g, "-"),
      };
      const res = await api.put("/jobs", requestBody);
      if (res.data) {
        toast.success("Job Aprovado!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
        setRefreshData(!refreshData);
      }
    } catch (err) {
      alert("Vish, deu não...");
      console.error(err);
    }
  };

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

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
              {tableHeaderRow.map((headCell) => (
                <TableCell
                  align={headCell.label === "Título" ? "" : "center"}
                  sx={{
                    fontSize: 14,
                    fontWeight: "bold",
                    pl: headCell.label === "Título" ? "" : 5,
                  }}
                  key={headCell.id}
                  sortDirection={orderBy === headCell.id ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : "asc"}
                    onClick={() => handleRequestSort(headCell.id)}
                  >
                    {headCell.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
            {sortedRows
              .slice(startIndex, endIndex)
              .filter((user) => {
                const userProperty = searchOption
                  .split(".")
                  .reduce((obj, key) => obj[key], user);
                const statusFilter =
                  !searchStatus || user.status === searchStatus;

                // Verifica se a condição para aplicar o filtro é atendida
                const shouldApplyStatusFilter =
                  statusFilter || searchStatus === "&nbsp";

                return (
                  userProperty &&
                  userProperty
                    .toLowerCase()
                    .includes(searchValue.toLowerCase()) &&
                  shouldApplyStatusFilter
                );
              })
              .map((job) => (
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
                        {job.createdBy}
                      </Typography>
                    </TableCell>
                    <TableCell
                      onClick={() => handleOpenDetail(job)}
                      cursor="pointer"
                      align="center"
                    >
                      <Grid container direction="row" justifyContent="center">
                        <Grid item>
                          <Avatar
                            alt="Imagem do Colaborador"
                            src={`http://localhost:3000/static/${job.worker.image}`}
                            sx={{ width: 32, height: 32, mr: 1 }}
                          />
                        </Grid>
                        <Grid item>
                          <Typography sx={{ mt: 0.75, fontSize: 14 }}>
                            {job.worker.name}
                          </Typography>
                        </Grid>
                      </Grid>
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
                      onClick={() => handleOpenDetail(job)}
                      align="center"
                      sx={{ p: 0 }}
                    >
                      <Typography
                        sx={{
                          fontSize: 14,
                          color:
                            (job.status === "Aprovado" && "#50C878") || "#777",
                        }}
                      >
                        {job.status}
                      </Typography>
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
                                <TableCell align="left">
                                  <Typography
                                    sx={{ fontSize: "14px", color: "#777" }}
                                  >
                                    Status
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
                                <TableCell align="left">
                                  <Typography>{job.status}</Typography>
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
                                  <Grid container direction="row">
                                    <Grid item>
                                      <Avatar
                                        alt="Imagem do Gerente"
                                        src={
                                          managers.find(
                                            (manager) =>
                                              manager.name === job.manager.name
                                          )
                                            ? `http://localhost:3000/static/${
                                                managers.find(
                                                  (manager) =>
                                                    manager.name ===
                                                    job.manager.name
                                                ).image
                                              }`
                                            : ""
                                        }
                                        sx={{ width: 32, height: 32, mr: 1 }}
                                      />
                                    </Grid>
                                    <Grid item>
                                      <Typography
                                        sx={{ mt: 0.75, fontSize: 14 }}
                                      >
                                        {job.manager ? job.manager.name : ""}
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                </TableCell>
                                <TableCell align="left">
                                  <Grid container direction="row">
                                    <Grid item>
                                      <Avatar
                                        alt="Imagem do Colaborador"
                                        src={`http://localhost:3000/static/${job.worker.image}`}
                                        sx={{ width: 32, height: 32, mr: 1 }}
                                      />
                                    </Grid>
                                    <Grid item>
                                      <Typography
                                        sx={{ mt: 0.75, fontSize: 14 }}
                                      >
                                        {job.worker.name}
                                      </Typography>
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
                        </Box>
                        <Box sx={{ my: 4, px: 6 }}>
                          <Typography
                            variant="h6"
                            sx={{ fontSize: 18, fontWeight: "bold" }}
                          >
                            Atividades
                          </Typography>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>
                                  <Typography
                                    sx={{ fontSize: "14px", color: "#777" }}
                                  >
                                    #
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    sx={{ fontSize: "14px", color: "#777" }}
                                  >
                                    Data
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    sx={{ fontSize: "14px", color: "#777" }}
                                  >
                                    Colaborador
                                  </Typography>
                                </TableCell>

                                <TableCell>
                                  <Typography
                                    sx={{ fontSize: "14px", color: "#777" }}
                                  >
                                    Atividade
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    sx={{ fontSize: "14px", color: "#777" }}
                                  >
                                    Reações
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {job.interactions.map((interaction) => (
                                <TableRow
                                  key={interaction.number}
                                  sx={{
                                    backgroundColor:
                                      interaction.number % 2 === 0
                                        ? "#eee"
                                        : "white",
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
                                  <TableCell align="left">
                                    {interaction.activity !==
                                      "Job aprovado" && (
                                      <Typography sx={{ fontSize: 12 }}>
                                        <InteractionReactions
                                          userId={user._id}
                                          refreshData={refreshData}
                                          setRefreshData={setRefreshData}
                                          interaction={interaction}
                                          job={job}
                                          number={interaction.number}
                                          userReactions={
                                            userReactions[job._id] || []
                                          }
                                          setUserReactions={(reactions) =>
                                            setUserReactions({
                                              ...userReactions,
                                              [job._id]: reactions,
                                            })
                                          }
                                          jobId={job._id}
                                        />
                                      </Typography>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>

                          {job.status !== "Concluido" && (
                            <RequestActions
                              selectedJob={selectedJob}
                              user={user}
                              job={job}
                              handleManagerApproval={handleManagerApproval}
                              handleOpenEdit={handleOpenEdit}
                              handleConfirmDelete={handleConfirmDelete}
                            />
                          )}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={sortedRows.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={"por Página"}
          labelDisplayedRows={({ from, to, count }) => {
            return " " + from + " à " + to + " total " + count;
          }}
        />
      </TableContainer>
      {openEdit && (
        <Dialog
          fullWidth
          maxWidth="lg"
          open={openEdit}
          onClose={() => setOpenEdit(!openEdit)}
        >
          <EditJobForm
            user={user}
            option={option}
            openEditJob={openEdit}
            selectedJob={selectedJob}
            setOpenEditJob={setOpenEdit}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            toast={toast}
          />
        </Dialog>
      )}
      {openDialog && (
        <Dialog open={openDialog} onClose={() => setOpenDialog(!openDialog)}>
          <GenericDeleteForm
            selectedItem={selectedItem}
            openDialog={openDialog}
            setOpenDialog={setOpenDialog}
            toast={toast}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            endpoint="jobs"
            successMessage={`${
              selectedItem.title && selectedItem.title
            } Deletado com Sucesso`}
          />
        </Dialog>
      )}
    </Box>
  );
}
