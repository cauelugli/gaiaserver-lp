/* eslint-disable react/prop-types */
import * as React from "react";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
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
  Checkbox,
  IconButton,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import InteractionReactions from "../components/small/InteractionReactions";

import EditJobForm from "../forms/edit/EditJobForm";
import GenericDeleteForm from "../forms/delete/GenericDeleteForm";
import JobTableActions from "../components/small/buttons/tableActionButtons/JobTableActions";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const socket = io("http://localhost:3000");

export default function JobTable({
  config,
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
  const [openDetailGeral, setOpenDetailGeral] = React.useState(true);
  const [openDetailDescrição, setOpenDetailDescrição] = React.useState(false);
  const [openDetailDepartamento, setOpenDetailDepartamento] =
    React.useState(false);
  const [openDetailOrçamento, setOpenDetailOrçamento] = React.useState(false);
  const [openDetailAtividades, setOpenDetailAtividades] = React.useState(false);
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
      id: "customer.name",
      label: "Cliente",
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
    {
      id: "actions",
      label: "Ações",
    },
  ];

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("status");

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
        manager: job.manager,
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

  const handleRequestApproval = async () => {
    try {
      const requestBody = {
        user,
        jobId: selectedJob._id,
        job: selectedJob,
        worker: selectedJob.worker,
        manager: selectedJob.manager,
        date: new Date().toLocaleDateString("pt-BR").replace(/\//g, "-"),
      };
      const res = await api.put("/jobs/requestApproval", requestBody);

      if (res.data) {
        toast.success("Aprovação Solicitada!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
        socket.emit("requestApproval", {
          sender: user,
          receiver: selectedJob.manager,
          job: selectedJob,
          date: dayjs(Date.now()).format("DD/MM/YYYY"),
        });
        setRefreshData(!refreshData);
      }
    } catch (err) {
      toast.error("Houve algum erro...", {
        closeOnClick: true,
        pauseOnHover: false,
        theme: "colored",
        autoClose: 1200,
      });
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

  const [showCompletedJobs, setShowCompletedJobs] = React.useState(false);

  const handleChangeShowCompletedJobs = () => {
    setShowCompletedJobs(!showCompletedJobs);
  };

  return (
    <Box sx={{ minWidth: "1250px" }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: -5.5 }}>
        <Checkbox
          checked={showCompletedJobs}
          onChange={handleChangeShowCompletedJobs}
        />
        <Typography sx={{ fontSize: 13, mt: 1.5, ml: -1 }}>
          Mostrar Jobs Concluídos
        </Typography>
      </Box>
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
                    fontSize: 13,
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
              .filter((job) => {
                if (!job) return false;
                const userProperty = searchOption
                  .split(".")
                  .reduce((obj, key) => obj[key], job);
                const statusFilter =
                  !searchStatus || job.status === searchStatus;

                const shouldApplyStatusFilter =
                  statusFilter || searchStatus === "&nbsp";

                const shouldShowJob =
                  userProperty &&
                  userProperty
                    .toLowerCase()
                    .includes(searchValue.toLowerCase()) &&
                  shouldApplyStatusFilter;

                return (
                  shouldShowJob &&
                  (showCompletedJobs || job.status !== "Concluido")
                );
              })
              .map((job) => (
                <>
                  <TableRow
                    key={job._id}
                    sx={{
                      cursor: "pointer",
                      backgroundColor:
                        selectedJob._id === job._id && openDetail
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
                      <Typography sx={{ fontSize: 13 }}>{job.title}</Typography>
                    </TableCell>
                    <TableCell
                      onClick={() => handleOpenDetail(job)}
                      cursor="pointer"
                      align="center"
                    >
                      <Typography sx={{ fontSize: 13 }}>
                        {job.requester}
                      </Typography>
                    </TableCell>
                    <TableCell
                      onClick={() => handleOpenDetail(job)}
                      cursor="pointer"
                      align="center"
                    >
                      <Typography sx={{ fontSize: 13 }}>
                        {job.customer.name}
                      </Typography>
                    </TableCell>
                    <TableCell
                      onClick={() => handleOpenDetail(job)}
                      cursor="pointer"
                      align="center"
                    >
                      <Typography sx={{ fontSize: 13 }}>
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
                          <Typography sx={{ mt: 0.75, fontSize: 13 }}>
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
                      <Typography sx={{ fontSize: 13 }}>
                        {job.selectedSchedule
                          ? job.selectedSchedule.split(" - ")[0] +
                            " " +
                            job.selectedSchedule.split(" - ")[1]
                          : dayjs(job.scheduledTo).format("DD/MM/YYYY")}
                      </Typography>
                    </TableCell>
                    <TableCell
                      onClick={() => handleOpenDetail(job)}
                      align="center"
                      sx={{ p: 0 }}
                    >
                      <Typography
                        sx={{
                          fontSize: 13,
                          color:
                            (job.status === "Aprovado" && "#50C878") || "#777",
                        }}
                      >
                        {job.status}
                      </Typography>
                    </TableCell>

                    <TableCell
                      cursor="pointer"
                      align="center"
                      onClick={() => setSelectedJob(job)}
                    >
                      <JobTableActions
                        selectedItem={selectedJob}
                        refreshData={refreshData}
                        setRefreshData={setRefreshData}
                        config={config}
                        user={user}
                        job={job}
                        handleManagerApproval={handleManagerApproval}
                        handleRequestApproval={handleRequestApproval}
                        handleOpenEdit={handleOpenEdit}
                        handleConfirmDelete={handleConfirmDelete}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={8}
                    >
                      <Collapse
                        in={openDetail && selectedJob._id === job._id}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box sx={{ my: 4, px: 6 }}>
                          <Grid container direction="row">
                            <Typography
                              variant="h6"
                              sx={{
                                fontSize: 18,
                                fontWeight: "bold",
                                my: "auto",
                              }}
                            >
                              Informações Gerais
                            </Typography>
                            <IconButton
                              onClick={() =>
                                setOpenDetailGeral(!openDetailGeral)
                              }
                            >
                              <ExpandMoreIcon />
                            </IconButton>
                          </Grid>

                          <Collapse
                            in={openDetailGeral}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
                                    >
                                      Título do Job
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="left">
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
                                    >
                                      Solicitante
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="left">
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
                                    >
                                      Cliente
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="left">
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
                                    >
                                      Status
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableRow>
                                  <TableCell align="left">
                                    <Typography sx={{ fontSize: 13 }}>
                                      {job.title}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="left">
                                    <Typography sx={{ fontSize: 13 }}>
                                      {job.requester}
                                    </Typography>
                                  </TableCell>

                                  <TableCell align="left">
                                    <Typography sx={{ fontSize: 13 }}>
                                      {job.customer.name}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="left">
                                    <Typography sx={{ fontSize: 13 }}>
                                      {job.status}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </Collapse>
                        </Box>
                        <Box sx={{ my: 4, px: 6 }}>
                          <Grid container direction="row">
                            <Typography
                              variant="h6"
                              sx={{
                                fontSize: 18,
                                fontWeight: "bold",
                                my: "auto",
                              }}
                            >
                              Descrição
                            </Typography>
                            <IconButton
                              onClick={() =>
                                setOpenDetailDescrição(!openDetailDescrição)
                              }
                            >
                              <ExpandMoreIcon />
                            </IconButton>
                          </Grid>
                          <Collapse
                            in={
                              openDetailDescrição && selectedJob._id === job._id
                            }
                            timeout="auto"
                            unmountOnExit
                          >
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
                                    >
                                      Sobre
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableRow>
                                  <TableCell align="left">
                                    <Typography sx={{ fontSize: 13 }}>
                                      {job.description}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </Collapse>
                        </Box>
                        <Box sx={{ my: 4, px: 6 }}>
                          <Grid container direction="row">
                            <Typography
                              variant="h6"
                              sx={{
                                fontSize: 18,
                                fontWeight: "bold",
                                my: "auto",
                              }}
                            >
                              Departamento
                            </Typography>
                            <IconButton
                              onClick={() =>
                                setOpenDetailDepartamento(
                                  !openDetailDepartamento
                                )
                              }
                            >
                              <ExpandMoreIcon />
                            </IconButton>
                          </Grid>
                          <Collapse
                            in={
                              openDetailDepartamento &&
                              selectedJob._id === job._id
                            }
                            timeout="auto"
                            unmountOnExit
                          >
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell align="left">
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
                                    >
                                      Nome do Departamento
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="left">
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
                                    >
                                      Gerente Responsável
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="left">
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
                                    >
                                      Colaborador Designado
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableRow>
                                  <TableCell align="left">
                                    <Typography sx={{ fontSize: 13 }}>
                                      {job.department.name}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="left">
                                    <Grid container direction="row">
                                      <Grid item>
                                        <Avatar
                                          alt="Imagem do Gerente"
                                          src={
                                            managers.find(
                                              (manager) =>
                                                manager.name ===
                                                job.manager.name
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
                                          sx={{ mt: 0.75, fontSize: 13 }}
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
                                          sx={{ mt: 0.75, fontSize: 13 }}
                                        >
                                          {job.worker.name}
                                        </Typography>
                                      </Grid>
                                    </Grid>
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </Collapse>
                        </Box>
                        <Box sx={{ my: 4, px: 6 }}>
                          <Grid container direction="row">
                            <Typography
                              variant="h6"
                              sx={{
                                fontSize: 18,
                                fontWeight: "bold",
                                my: "auto",
                              }}
                            >
                              Orçamento
                            </Typography>
                            <IconButton
                              onClick={() =>
                                setOpenDetailOrçamento(!openDetailOrçamento)
                              }
                            >
                              <ExpandMoreIcon />
                            </IconButton>
                          </Grid>
                          <Collapse
                            in={
                              openDetailOrçamento && selectedJob._id === job._id
                            }
                            timeout="auto"
                            unmountOnExit
                          >
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
                                    >
                                      Nº do Orçamento
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
                                    >
                                      Serviço
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="left">
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
                                    >
                                      Materiais
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="left">
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
                                    >
                                      Valor Total (serviço + materiais)
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableRow>
                                  <TableCell component="th" scope="row">
                                    <Typography sx={{ fontSize: 13 }}>
                                      {job.quoteNumber}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="left">
                                    <Typography sx={{ fontSize: 13 }}>
                                      {job.service.name}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="left">
                                    <Typography sx={{ fontSize: 13 }}>
                                      {job.materials.length > 0
                                        ? job.materials.map((material) => (
                                            <Typography
                                              sx={{ fontSize: 13 }}
                                              key={material.id}
                                            >
                                              x{material.quantity}{" "}
                                              {material.name}
                                            </Typography>
                                          ))
                                        : "Não há uso de Materiais"}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="left">
                                    <Typography sx={{ fontSize: 13 }}>
                                      R${job.price}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </Collapse>
                        </Box>
                        <Box sx={{ my: 4, px: 6 }}>
                          <Grid container direction="row">
                            <Typography
                              variant="h6"
                              sx={{
                                fontSize: 18,
                                fontWeight: "bold",
                                my: "auto",
                              }}
                            >
                              Atividades
                            </Typography>
                            <IconButton
                              onClick={() =>
                                setOpenDetailAtividades(!openDetailAtividades)
                              }
                            >
                              <ExpandMoreIcon />
                            </IconButton>
                          </Grid>
                          <Collapse
                            in={
                              openDetailAtividades &&
                              selectedJob._id === job._id
                            }
                            timeout="auto"
                            unmountOnExit
                          >
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
                                    >
                                      #
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
                                    >
                                      Data
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
                                    >
                                      Colaborador
                                    </Typography>
                                  </TableCell>

                                  <TableCell>
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
                                    >
                                      Atividade
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
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
                                      <Typography sx={{ fontSize: 13 }}>
                                        {interaction.number}
                                      </Typography>
                                    </TableCell>
                                    <TableCell align="left">
                                      <Typography sx={{ fontSize: 13 }}>
                                        {interaction.date}
                                      </Typography>
                                    </TableCell>
                                    <TableCell align="left">
                                      <Typography sx={{ fontSize: 13 }}>
                                        {interaction.user}
                                      </Typography>
                                    </TableCell>
                                    <TableCell align="left">
                                      <Typography sx={{ fontSize: 13 }}>
                                        {interaction.activity}
                                      </Typography>
                                    </TableCell>
                                    <TableCell align="left">
                                      {interaction.activity !==
                                        "Job aprovado" && (
                                        <Typography sx={{ fontSize: 13 }}>
                                          <InteractionReactions
                                            user={user}
                                            manager={job.manager}
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
                          </Collapse>

                          {/* {job.status !== "Concluido" && (
                            <RequestActions
                              config={config}
                              selectedJob={selectedJob}
                              user={user}
                              job={job}
                              handleManagerApproval={handleManagerApproval}
                              handleRequestApproval={handleRequestApproval}
                              handleOpenEdit={handleOpenEdit}
                              handleConfirmDelete={handleConfirmDelete}
                            />
                          )} */}
                        </Box>
                        {job.status === "Concluido" && (
                          <Box sx={{ my: 4, px: 6, mb: 6 }}>
                            <Typography
                              variant="h6"
                              sx={{ fontSize: 18, fontWeight: "bold" }}
                            >
                              Resolução
                            </Typography>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
                                    >
                                      Data da Resolução
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
                                    >
                                      Resolvido por
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
                                    >
                                      Resolução
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableRow>
                                  <TableCell>
                                    <Typography sx={{ fontSize: 13 }}>
                                      {job.resolvedAt}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="left">
                                    <Typography sx={{ fontSize: 13 }}>
                                      {job.resolvedBy}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="left">
                                    <Typography sx={{ fontSize: 13 }}>
                                      {job.resolution}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </Box>
                        )}
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </>
              ))
              .slice(startIndex, endIndex)}
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
