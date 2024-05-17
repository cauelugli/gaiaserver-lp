/* eslint-disable react/prop-types */
import * as React from "react";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

const socket = io("http://localhost:5002");

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
  Tooltip,
  Button,
  Popover,
  InputBase,
} from "@mui/material";

import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import InteractionReactions from "../components/small/InteractionReactions";
import JobTableActions from "../components/small/buttons/tableActionButtons/JobTableActions";

import EditJobForm from "../forms/edit/EditJobForm";
import AddJobInteractionForm from "../forms/misc/AddJobInteractionForm";
import ViewDialog from "../components/small/ViewDialog";
import AddAttachmentsForm from "../forms/misc/AddAttachmentsForm";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function JobTable({
  userId,
  userName,
  userUsername,
  userRole,
  searchValue,
  searchStatus,
  searchOption,
  jobs,
  managers,
  refreshData,
  setRefreshData,
  topBar,
}) {
  const [userReactions, setUserReactions] = React.useState({});
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openAddInteraction, setOpenAddInteraction] = React.useState(false);
  const [openAddAttachments, setOpenAddAttachments] = React.useState(false);
  const [openDetail, setOpenDetail] = React.useState(false);
  const [openDetailInfo, setOpenDetailInfo] = React.useState(true);
  const [openDetailAttachments, setOpenDetailAttachments] =
    React.useState(false);
  const [openDetailActivities, setOpenDetailActivities] = React.useState(false);
  const [selectedJob, setSelectedJob] = React.useState([]);
  const [selectedItem, setSelectedItem] = React.useState("");
  const [openViewDialog, setOpenViewDialog] = React.useState(false);
  const [openViewDialog2, setOpenViewDialog2] = React.useState(false);
  const [openAddInteractionOnTable, setOpenAddInteractionOnTable] =
    React.useState(false);
  const [activity, setActivity] = React.useState("");
  const [attachments, setAttachments] = React.useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openPopoverIndex, setOpenPopoverIndex] = React.useState(null);

  const handleOpenDetail = (job) => {
    setOpenDetail(!openDetail);
    setSelectedJob(job);
  };

  const handleOpenEdit = (job) => {
    setOpenEdit(!openEdit);
    setSelectedJob(job);
  };

  const handleDeleteAttachment = async (jobId, attachmentIndex) => {
    try {
      const response = await api.put("/jobs/deleteAttachment", {
        jobId,
        attachmentIndex,
      });

      if (response.data) {
        toast.success("Anexo deletado com sucesso!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
        setRefreshData(!refreshData);
      }
    } catch (err) {
      toast.error("Erro ao deletar o anexo. Tente novamente.", {
        closeOnClick: true,
        pauseOnHover: false,
        theme: "colored",
        autoClose: 1200,
      });
      console.error(err);
    }
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

  const handleManagerApproval = async () => {
    try {
      const requestBody = {
        jobId: selectedJob.id || selectedJob._id,
        status: "Aprovado",
        manager: selectedJob.manager,
        userName,
        date: new Date().toLocaleDateString("pt-BR").replace(/\//g, "-"),
      };
      const res = await api.put("/jobs/managerApproval", requestBody);
      if (res.data) {
        toast.success("Job Aprovado!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
        socket.emit("newDataRefreshButton", {
          page: "requests",
          userId: userId,
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
      console.error(err);
    }
  };

  const handleRequestApproval = async () => {
    console.log("selectedJob.manager", selectedJob.manager);
    try {
      const requestBody = {
        user: userName,
        jobId: selectedJob._id,
        jobManager: selectedJob.manager.name,
        date: dayjs().format("DD/MM/YYYY HH:mm"),
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
          sender: userName,
          receiver: selectedJob.manager.name,
          receiverId: selectedJob.manager.id,
          job: selectedJob,
          type: "Job",
          date: dayjs(Date.now()).format("DD/MM/YYYY HH:mm"),
        });
        socket.emit("newDataRefreshButton", {
          page: "requests",
          userId: userId,
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

  const addInteractionToJob = (updatedJob) => {
    setSelectedJob(updatedJob);
    setRefreshData(!refreshData);
  };

  const handleAddInteractionFromTable = async (e) => {
    e.preventDefault();
    try {
      let uploadResponses = [];
      if (attachments.length !== 0) {
        for (const file of attachments) {
          const formData = new FormData();
          formData.append("attachment", file);
          formData.append("itemId", selectedJob._id);

          const uploadResponse = await api.post(
            "/uploads/singleAttachment",
            formData
          );
          uploadResponses.push(uploadResponse.data.attachmentPath);
        }

        await api.put(`/jobs/addAttachments`, {
          itemId: selectedJob._id,
          attachments: uploadResponses,
          userName,
          date: dayjs().format("DD/MM HH:mm"),
        });
      }

      const requestBody = {
        jobId: selectedJob._id,
        activity,
        attachments: uploadResponses,
        userName,
        date: dayjs().format("DD/MM HH:mm"),
      };

      const res = await api.put("/jobs/interaction", requestBody);
      if (res.data) {
        toast.success("Interação Adicionada!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
        socket.emit("newDataRefreshButton", {
          page: "requests",
          userId: userId,
        });
      }
      setOpenAddInteractionOnTable(false);
      setActivity("");
      setAttachments([]);
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
  const [showArchivedJobs, setShowArchivedJobs] = React.useState(false);

  const filteredResolvedCount = sortedRows.filter(
    (row) => row.status === "Concluido"
  ).length;

  const filteredArchivedCount = sortedRows.filter(
    (row) => row.status === "Arquivado"
  ).length;

  const filteredValidCount = sortedRows.filter(
    (row) => row.status !== "Arquivado" && row.status !== "Concluido"
  ).length;

  const imageExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".bmp",
    ".tiff",
    ".webp",
  ];

  const isImage = (filename) =>
    imageExtensions.some((extension) => filename.endsWith(extension));

  const isPdf = (filename) => filename.endsWith(".pdf");

  const handlePopoverOpen = (index) => (event) => {
    setAnchorEl(event.currentTarget);
    setOpenPopoverIndex(index);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setOpenPopoverIndex(null);
  };

  const updateSelectedJobInteractions = (updatedInteractions) => {
    setSelectedJob((currentSelectedJob) => ({
      ...currentSelectedJob,
      interactions: updatedInteractions,
    }));
  };

  const handleFileChange = (event) => {
    setAttachments([...attachments, ...event.target.files]);
  };

  const removeFile = (indexToRemove) => {
    setAttachments(attachments.filter((_, index) => index !== indexToRemove));
  };

  return (
    <Box sx={{ width: topBar ? "105%" : "100%", minHeight: "50vw" }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: -5.5 }}>
        <Checkbox
          checked={showCompletedJobs}
          onChange={() => setShowCompletedJobs(!showCompletedJobs)}
        />
        <Typography sx={{ fontSize: 13, mt: 1.5, ml: -1 }}>
          Mostrar Concluídos
        </Typography>
        <Checkbox
          checked={showArchivedJobs}
          onChange={() => setShowArchivedJobs(!showArchivedJobs)}
        />
        <Typography sx={{ fontSize: 13, mt: 1.5, ml: -1 }}>
          Mostrar Arquivados
        </Typography>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow>
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
                  (showCompletedJobs || job.status !== "Concluido") &&
                  (showArchivedJobs || job.status !== "Arquivado")
                );
              })
              .map((job) => (
                <>
                  <TableRow key={job._id} sx={{ cursor: "pointer" }}>
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
                        <Tooltip title={job.worker.name}>
                          <Avatar
                            alt="Imagem do Colaborador"
                            src={`http://localhost:3000/static/${job.worker.image}`}
                            sx={{ width: 32, height: 32, mr: 1 }}
                          />
                        </Tooltip>
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
                        userName={userName}
                        userId={userId}
                        userRole={userRole}
                        job={job}
                        handleManagerApproval={handleManagerApproval}
                        handleRequestApproval={handleRequestApproval}
                        handleOpenEdit={handleOpenEdit}
                        handleOpenAddJobInteraction={setOpenAddInteraction}
                        handleOpenAddAttachment={setOpenAddAttachments}
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
                              Informações
                            </Typography>
                            <IconButton
                              onClick={() => setOpenDetailInfo(!openDetailInfo)}
                            >
                              <ExpandMoreIcon />
                            </IconButton>
                          </Grid>

                          <Collapse
                            in={openDetailInfo}
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

                            <Table size="small" sx={{ mt: 2 }}>
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

                            <Table size="small" sx={{ mt: 2 }}>
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
                                            job.manager
                                              ? managers.find(
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
                                              : "-"
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

                            <Table size="small" sx={{ mt: 2 }}>
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
                              Anexos
                            </Typography>
                            <IconButton
                              onClick={() =>
                                setOpenDetailAttachments(!openDetailAttachments)
                              }
                            >
                              <ExpandMoreIcon />
                            </IconButton>
                          </Grid>
                          <Collapse
                            in={
                              openDetailAttachments &&
                              selectedJob._id === job._id
                            }
                            timeout="auto"
                            unmountOnExit
                          >
                            {job.attachments.length !== 0 && (
                              <Table size="small" sx={{ mt: 1 }}>
                                <TableHead>
                                  <TableRow>
                                    <TableCell>
                                      <Typography
                                        sx={{ fontSize: 13, color: "#777" }}
                                      >
                                        Anexos
                                      </Typography>
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  <TableRow>
                                    <TableCell align="left">
                                      <Grid container direction="row">
                                        {job.attachments.map(
                                          (attachment, index) => (
                                            <Grid
                                              key={index}
                                              item
                                              sx={{
                                                mr: 1,
                                              }}
                                            >
                                              <Grid
                                                container
                                                dierction="column"
                                                alignItems="center"
                                                justifyContent="center"
                                              >
                                                <Grid
                                                  container
                                                  direction="column"
                                                  alignItems="center"
                                                  sx={{
                                                    cursor: "pointer",
                                                    border:
                                                      "1px solid darkgrey",
                                                    borderRadius: 2,
                                                    padding: 1,
                                                  }}
                                                  onClick={() => {
                                                    setSelectedItem(attachment);
                                                    setOpenViewDialog(true);
                                                  }}
                                                >
                                                  {isPdf(attachment) ? (
                                                    <img
                                                      src={`http://localhost:3000/static/pdf.png`}
                                                      alt="PDF"
                                                      style={{
                                                        width: "80px",
                                                        height: "80px",
                                                        marginBottom: "8px",
                                                      }}
                                                    />
                                                  ) : isImage(attachment) ? (
                                                    <img
                                                      src={`http://localhost:3000/static/${attachment}`}
                                                      alt="Arquivo Inexistente"
                                                      style={{
                                                        width: "80px",
                                                        height: "80px",
                                                        marginBottom: "8px",
                                                      }}
                                                    />
                                                  ) : (
                                                    <img
                                                      src={`http://localhost:3000/static/doc.png`}
                                                      alt="Other"
                                                      style={{
                                                        width: "80px",
                                                        height: "80px",
                                                        marginBottom: "8px",
                                                      }}
                                                    />
                                                  )}
                                                  <Typography
                                                    sx={{
                                                      fontSize: 10,
                                                      color: "#777",
                                                      maxWidth: "75px",
                                                      whiteSpace: "nowrap",
                                                      overflow: "hidden",
                                                      textOverflow: "ellipsis",
                                                    }}
                                                  >
                                                    {
                                                      attachment
                                                        .split("/")
                                                        .pop()
                                                        .split(".")[1]
                                                    }
                                                  </Typography>
                                                </Grid>
                                                {userUsername === "admin" && (
                                                  <Button
                                                    size="small"
                                                    color="error"
                                                    onClick={() =>
                                                      handleDeleteAttachment(
                                                        job._id,
                                                        index
                                                      )
                                                    }
                                                  >
                                                    <DeleteIcon />
                                                  </Button>
                                                )}
                                              </Grid>
                                            </Grid>
                                          )
                                        )}
                                      </Grid>
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            )}
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
                                setOpenDetailActivities(!openDetailActivities)
                              }
                            >
                              <ExpandMoreIcon />
                            </IconButton>
                          </Grid>
                          <Collapse
                            in={
                              openDetailActivities &&
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
                                      Anexos
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
                                      Reações
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {job.interactions.map((interaction, index) => (
                                  <TableRow
                                    key={index}
                                    sx={{
                                      backgroundColor:
                                        interaction.number % 2 === 0
                                          ? "#eee"
                                          : "white",
                                    }}
                                  >
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
                                      {interaction.attachments.length !== 0 && (
                                        <Grid>
                                          <AttachFileIcon
                                            sx={{
                                              fontSize: 16,
                                              color: "#777",
                                              cursor: "pointer",
                                            }}
                                            onClick={handlePopoverOpen(index)}
                                          />
                                          {openPopoverIndex === index && (
                                            <Popover
                                              open={Boolean(anchorEl)}
                                              anchorEl={anchorEl}
                                              onClose={handlePopoverClose}
                                              anchorOrigin={{
                                                vertical: "bottom",
                                                horizontal: "left",
                                              }}
                                            >
                                              <Box
                                                p={2}
                                                sx={{
                                                  width: "auto",
                                                  maxWidth: 460,
                                                  height: "auto",
                                                  maxHeight: 280,
                                                }}
                                              >
                                                <Typography
                                                  variant="h6"
                                                  sx={{ color: "#555" }}
                                                >
                                                  Anexos
                                                </Typography>
                                                <Grid container direction="row">
                                                  {interaction.attachments.map(
                                                    (
                                                      attachment,
                                                      attachmentIndex
                                                    ) => (
                                                      <Grid
                                                        key={attachmentIndex}
                                                        sx={{
                                                          mr: 2,
                                                          mb: 2,
                                                          cursor: "pointer",
                                                          border:
                                                            "1px solid darkgrey",
                                                          borderRadius: 2,
                                                          padding: 1,
                                                        }}
                                                        onClick={() => {
                                                          setSelectedItem(
                                                            attachment
                                                          );
                                                          setOpenViewDialog(
                                                            true
                                                          );
                                                        }}
                                                      >
                                                        {isPdf(attachment) ? (
                                                          <img
                                                            src={`http://localhost:3000/static/pdf.png`}
                                                            alt="PDF"
                                                            style={{
                                                              width: "80px",
                                                              height: "80px",
                                                              marginBottom:
                                                                "8px",
                                                            }}
                                                          />
                                                        ) : isImage(
                                                            attachment
                                                          ) ? (
                                                          <img
                                                            src={`http://localhost:3000/static/${attachment}`}
                                                            alt="Arquivo Inexistente"
                                                            style={{
                                                              width: "80px",
                                                              height: "80px",
                                                              marginBottom:
                                                                "8px",
                                                            }}
                                                          />
                                                        ) : (
                                                          <img
                                                            src={`http://localhost:3000/static/doc.png`}
                                                            alt="Other"
                                                            style={{
                                                              width: "80px",
                                                              height: "80px",
                                                              marginBottom:
                                                                "8px",
                                                            }}
                                                          />
                                                        )}
                                                      </Grid>
                                                    )
                                                  )}
                                                </Grid>
                                              </Box>
                                            </Popover>
                                          )}
                                        </Grid>
                                      )}
                                    </TableCell>
                                    <TableCell align="left">
                                      <Typography sx={{ fontSize: 13 }}>
                                        {interaction.date}
                                      </Typography>
                                    </TableCell>
                                    <TableCell align="left">
                                      {interaction.activity !==
                                        "Job aprovado" && (
                                        <Typography sx={{ fontSize: 13 }}>
                                          <InteractionReactions
                                            userId={userId}
                                            userName={userName}
                                            itemId={job._id}
                                            manager={job.manager}
                                            refreshData={refreshData}
                                            setRefreshData={setRefreshData}
                                            interaction={interaction}
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
                                            updateInteractions={
                                              updateSelectedJobInteractions
                                            }
                                          />
                                        </Typography>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                            {openAddInteractionOnTable ? (
                              <>
                                <Grid item>
                                  <Typography
                                    sx={{
                                      mb: 2,
                                      mt: 4,
                                      fontSize: 18,
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Nova Interação
                                  </Typography>
                                  <Paper
                                    elevation={1}
                                    component="form"
                                    sx={{
                                      p: "2px 4px",
                                      display: "flex",
                                      alignItems: "center",
                                      mx: "15%",
                                    }}
                                  >
                                    <InputBase
                                      sx={{ ml: 1, flex: 1 }}
                                      placeholder="Atividade"
                                      value={activity}
                                      onChange={(e) =>
                                        setActivity(e.target.value)
                                      }
                                    />
                                    <input
                                      type="file"
                                      multiple
                                      id="fileInput"
                                      style={{ display: "none" }}
                                      onChange={handleFileChange}
                                    />
                                    <label htmlFor="fileInput">
                                      <IconButton
                                        component="span"
                                        aria-label="upload picture"
                                        sx={{ p: "10px" }}
                                      >
                                        <AttachFileIcon />
                                      </IconButton>
                                    </label>
                                  </Paper>

                                  {attachments.length !== 0 && (
                                    <Paper
                                      elevation={1}
                                      component="form"
                                      sx={{
                                        p: "2px 4px",
                                        display: "flex",
                                        alignItems: "center",
                                        mx: "15%",
                                        mt: 2,
                                      }}
                                    >
                                      <Grid item>
                                        <Grid container direction="row">
                                          {attachments.map(
                                            (attachment, index) => (
                                              <Grid
                                                key={index}
                                                item
                                                sx={{ mr: 1 }}
                                              >
                                                <Grid
                                                  container
                                                  direction="column"
                                                  alignItems="center"
                                                  sx={{
                                                    border:
                                                      "1px solid darkgrey",
                                                    borderRadius: 2,
                                                    padding: 1,
                                                  }}
                                                >
                                                  {isPdf(attachment.name) ? (
                                                    <img
                                                      src={`http://localhost:3000/static/pdf.png`}
                                                      alt="PDF"
                                                      style={{
                                                        width: "80px",
                                                        height: "80px",
                                                        marginBottom: "8px",
                                                      }}
                                                    />
                                                  ) : isImage(
                                                      attachment.name
                                                    ) ? (
                                                    <img
                                                      src={URL.createObjectURL(
                                                        attachment
                                                      )}
                                                      alt="Arquivo Inexistente"
                                                      style={{
                                                        width: "80px",
                                                        height: "80px",
                                                        marginBottom: "8px",
                                                      }}
                                                    />
                                                  ) : (
                                                    <img
                                                      src={`http://localhost:3000/static/doc.png`}
                                                      alt="Other"
                                                      style={{
                                                        width: "80px",
                                                        height: "80px",
                                                        marginBottom: "8px",
                                                      }}
                                                    />
                                                  )}
                                                  <Typography
                                                    sx={{
                                                      fontSize: 10,
                                                      color: "#777",
                                                      maxWidth: "75px",
                                                      whiteSpace: "nowrap",
                                                      overflow: "hidden",
                                                      textOverflow: "ellipsis",
                                                    }}
                                                  >
                                                    {attachment.name}
                                                  </Typography>

                                                  <Grid item>
                                                    <Grid
                                                      container
                                                      direction="row"
                                                      justifyContent="space-around"
                                                    >
                                                      <Button
                                                        size="small"
                                                        onClick={() => {
                                                          setSelectedItem(
                                                            attachment
                                                          );
                                                          setOpenViewDialog2(
                                                            true
                                                          );
                                                        }}
                                                      >
                                                        <VisibilityIcon />
                                                      </Button>
                                                      <Button
                                                        size="small"
                                                        color="error"
                                                        onClick={() =>
                                                          removeFile(index)
                                                        }
                                                      >
                                                        <DeleteIcon />
                                                      </Button>
                                                    </Grid>
                                                  </Grid>
                                                </Grid>
                                              </Grid>
                                            )
                                          )}
                                        </Grid>
                                      </Grid>
                                    </Paper>
                                  )}
                                  <Grid item>
                                    <Grid
                                      container
                                      direction="row"
                                      justifyContent="flex-end"
                                    >
                                      <Button
                                        variant="contained"
                                        disabled={activity === ""}
                                        color="success"
                                        sx={{ my: 2, mr: 2 }}
                                        onClick={handleAddInteractionFromTable}
                                      >
                                        Adicionar
                                      </Button>
                                      <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() =>
                                          setOpenAddInteractionOnTable(false)
                                        }
                                        sx={{ my: 2 }}
                                      >
                                        X
                                      </Button>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </>
                            ) : (
                              <Grid sx={{ ml: "90%" }}>
                                <Button
                                  sx={{ my: 1 }}
                                  size="small"
                                  variant="contained"
                                  color="success"
                                  onClick={() =>
                                    setOpenAddInteractionOnTable(true)
                                  }
                                >
                                  + Interação
                                </Button>
                              </Grid>
                            )}
                          </Collapse>
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
          count={
            filteredValidCount +
            (showCompletedJobs && filteredResolvedCount) +
            (showArchivedJobs && filteredArchivedCount)
          }
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
            openEditJob={openEdit}
            selectedJob={selectedJob}
            setOpenEditJob={setOpenEdit}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            toast={toast}
          />
        </Dialog>
      )}
      {openAddInteraction && (
        <Dialog
          fullWidth
          maxWidth="lg"
          open={openAddInteraction}
          onClose={() => setOpenAddInteraction(!openAddInteraction)}
        >
          <AddJobInteractionForm
            userId={userId}
            userName={userName}
            openEditJob={openAddInteraction}
            selectedJob={selectedJob}
            setOpenEditJob={setOpenAddInteraction}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            toast={toast}
            addInteractionToJob={addInteractionToJob}
            updateSelectedJobInteractions={updateSelectedJobInteractions}
          />
        </Dialog>
      )}
      {openAddAttachments && (
        <Dialog
          fullWidth
          maxWidth="md"
          open={openAddAttachments}
          onClose={() => setOpenAddAttachments(!openAddAttachments)}
        >
          <AddAttachmentsForm
            userName={userName}
            userId={userId}
            selectedJob={selectedJob}
            setOpenAddAttachments={setOpenAddAttachments}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            toast={toast}
            endpoint="jobs"
            usePageNotEndpoint
            page="requests"
          />
        </Dialog>
      )}
      {openViewDialog && (
        <Dialog
          open={openViewDialog}
          onClose={() => setOpenViewDialog(false)}
          fullWidth
          maxWidth="lg"
        >
          <ViewDialog
            selectedItem={selectedItem}
            setOpenViewDialog={setOpenViewDialog}
          />
        </Dialog>
      )}
      {openViewDialog2 && (
        <Dialog
          open={openViewDialog2}
          onClose={() => setOpenViewDialog2(false)}
          fullWidth
          maxWidth="lg"
        >
          <ViewDialog
            selectedItem={selectedItem.name}
            setOpenViewDialog={setOpenViewDialog2}
            createObjectURL
            createObjectURLItem={selectedItem}
          />
        </Dialog>
      )}
    </Box>
  );
}
