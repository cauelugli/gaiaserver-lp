/* eslint-disable react/prop-types */
import * as React from "react";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import dayjs from "dayjs";
import axios from "axios";

import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  Collapse,
  Dialog,
  Grid,
  IconButton,
  InputBase,
  Paper,
  Popover,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import VisibilityIcon from "@mui/icons-material/Visibility";

import ProjectTaskActions from "../components/small/buttons/ProjectTaskActions";
import ProjectTableActions from "../components/small/buttons/tableActionButtons/ProjectTableActions";
import ViewDialog from "../components/small/ViewDialog";
import AddAttachmentsForm from "../forms/misc/AddAttachmentsForm";
import InteractionReactions from "../components/small/InteractionReactions";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const socket = io("http://localhost:3000");

export default function ProjectsTable({
  userId,
  userName,
  userUsername,
  userImage,
  searchValue,
  searchOption,
  projects,
  refreshData,
  setRefreshData,
  topBar,
}) {
  const [userReactions, setUserReactions] = React.useState({});
  const [selectedProject, setSelectedProject] = React.useState("");
  // const [openEdit, setOpenEdit] = React.useState(false);
  const [openDetail, setOpenDetail] = React.useState(false);
  const [openAddAttachments, setOpenAddAttachments] = React.useState(false);
  const [openDetailInfo, setOpenDetailInfo] = React.useState(true);
  const [openDetailStages, setOpenDetailStages] = React.useState(true);
  const [selectedItem, setSelectedItem] = React.useState("");
  const [isAddingInteraction, setIsAddingInteraction] = React.useState(false);
  const [isAddingResolution, setIsAddingResolution] = React.useState(false);
  const [openViewDialog, setOpenViewDialog] = React.useState(false);
  const [openViewDialog2, setOpenViewDialog2] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openPopoverIndex, setOpenPopoverIndex] = React.useState(null);

  const [newInteractionText, setNewInteractionText] = React.useState("");
  const [attachments, setAttachments] = React.useState([]);
  const [resolutionText, setResolutionText] = React.useState("");
  const [selectedStageIndex, setSelectedStageIndex] = React.useState(null);
  const [selectedTaskIndex, setSelectedTaskIndex] = React.useState(null);

  const handleOpenDetail = (project) => {
    setOpenDetail(!openDetail);
    setSelectedProject(project);
  };

  const tableHeaderRow = [
    {
      id: "name",
      label: "Nome do Projeto",
    },
    {
      id: "type",
      label: "Tipo",
    },
    {
      id: "customer.name",
      label: "Cliente",
    },
    {
      id: "stage",
      label: "Fase Atual",
    },
    {
      id: "creator.name",
      label: "Criador",
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
  const [orderBy, setOrderBy] = React.useState("name");

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

    if (orderBy === "project.name") {
      return [...projects].sort(compare);
    }

    return [...projects].sort((a, b) => {
      const isAsc = order === "asc";
      if (isAsc) {
        return a[orderBy] < b[orderBy] ? -1 : 1;
      } else {
        return b[orderBy] < a[orderBy] ? -1 : 1;
      }
    });
  }, [projects, order, orderBy]);

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

  const handleAddInteraction = async () => {
    try {
      const uploadResponses = [];
      for (const file of attachments) {
        const formData = new FormData();
        formData.append("attachment", file);
        formData.append("itemId", selectedProject._id);

        const uploadResponse = await api.post(
          "/uploads/singleAttachment",
          formData
        );
        uploadResponses.push(uploadResponse.data.attachmentPath);
      }

      await api.put(`/projects/addAttachments`, {
        itemId: selectedProject._id,
        attachments: uploadResponses,
        userName,
        date: dayjs().format("DD/MM HH:mm"),
      });

      const res = await api.post("/projects/addInteraction", {
        projectId: selectedProject._id,
        stageIndex: selectedStageIndex,
        taskIndex: selectedTaskIndex,
        interaction: newInteractionText,
        attachments: uploadResponses,
        user: { id: userId, name: userName },
        createdAt: dayjs().format("DD/MM/YYYY"),
      });

      if (res.data) {
        toast.success("Interação Adicionada!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
        setNewInteractionText("");
        setSelectedTaskIndex(null);
        setSelectedStageIndex(null);
        setIsAddingInteraction(false);
        setRefreshData(!refreshData);
        const memberIds = res.data.stages[selectedStageIndex].tasks[
          selectedTaskIndex
        ].assignees.map((assignee) => assignee.id);
        socket.emit("notifyTaskAssignees", {
          sender: userName,
          list: memberIds,
          date: dayjs(Date.now()).format("DD/MM/YYYY"),
          projectName: selectedProject.name,
        });
      }
    } catch (error) {
      toast.error("Houve algum erro...", {
        closeOnClick: true,
        pauseOnHover: false,
        theme: "colored",
        autoClose: 1200,
      });
      console.log(error);
    }
  };

  const handleResolveTask = async () => {
    try {
      const response = await api.post("/projects/resolveTask", {
        projectId: selectedProject._id,
        stageIndex: selectedStageIndex,
        taskIndex: selectedTaskIndex,
        resolution: resolutionText,
        user: { id: userId, name: userName },
        createdAt: dayjs().format("DD/MM/YYYY"),
      });

      setResolutionText("");
      setSelectedTaskIndex(null);
      setSelectedStageIndex(null);
      setIsAddingResolution(false);
      setRefreshData(!refreshData);

      if (response.status === 200) {
        toast.success("Tarefa Resolvida!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
        const memberIds = response.data.stages[selectedStageIndex].tasks[
          selectedTaskIndex
        ].assignees.map((assignee) => assignee.id);
        socket.emit("resolvedTask", {
          sender: userName,
          list: memberIds,
          date: dayjs(Date.now()).format("DD/MM/YYYY"),
          projectName: selectedProject.name,
        });
      } else if (response.status === 207) {
        const memberIds = response.data.members.map((member) => member.id);
        socket.emit("resolvedProject", {
          sender: userName,
          list: memberIds,
          date: dayjs(Date.now()).format("DD/MM/YYYY"),
          projectName: selectedProject.name,
        });
      }
    } catch (error) {
      toast.error("Houve algum erro...", {
        closeOnClick: true,
        pauseOnHover: false,
        theme: "colored",
        autoClose: 1200,
      });
    }
  };

  const handleDeleteAttachment = async (projectId, attachmentIndex) => {
    try {
      const response = await api.put("/projects/deleteAttachment", {
        projectId,
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

  const handleFileChange = (event) => {
    setAttachments([...attachments, ...event.target.files]);
  };

  const removeFile = (indexToRemove) => {
    setAttachments(attachments.filter((_, index) => index !== indexToRemove));
  };

  const handlePopoverOpen = (index) => (event) => {
    setAnchorEl(event.currentTarget);
    setOpenPopoverIndex(index);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setOpenPopoverIndex(null);
  };

  const updateSelectedProjectInteractions = (updatedInteractions) => {
    setSelectedProject((currentSelected) => ({
      ...currentSelected,
      interactions: updatedInteractions,
    }));
  };

  return (
    <Box sx={{ width: topBar ? "105%" : "100%" }}>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow>
              {tableHeaderRow.map((headCell) => (
                <TableCell
                  align={headCell.label === "Nome do Projeto" ? "" : "center"}
                  sx={{
                    fontSize: 13,
                    fontWeight: "bold",
                    pl: headCell.label === "Nome do Projeto" ? "" : 5,
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
              .filter((item) =>
                item[searchOption]
                  .toLowerCase()
                  .includes(searchValue.toLowerCase())
              )
              .map((project) => (
                <>
                  <TableRow key={project._id} sx={{ cursor: "pointer" }}>
                    <TableCell
                      onClick={() => handleOpenDetail(project)}
                      cursor="pointer"
                    >
                      <Typography sx={{ fontSize: 13 }}>
                        {project.name}
                      </Typography>
                    </TableCell>

                    <TableCell
                      onClick={() => handleOpenDetail(project)}
                      cursor="pointer"
                      align="center"
                    >
                      <Typography sx={{ fontSize: 13 }}>
                        {project.type}
                      </Typography>
                    </TableCell>
                    <TableCell
                      onClick={() => handleOpenDetail(project)}
                      cursor="pointer"
                      align="center"
                    >
                      <Typography sx={{ fontSize: 13 }}>
                        {project.customer.name}
                      </Typography>
                    </TableCell>
                    <TableCell
                      onClick={() => handleOpenDetail(project)}
                      cursor="pointer"
                      align="center"
                    >
                      <Grid
                        container
                        direction="row"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Paper
                          elevation={0}
                          sx={{
                            mr: 1,
                            width: 13,
                            height: 13,
                            borderRadius: 100,
                            backgroundColor:
                              project.definedStagesColors[0] !== null
                                ? project.definedStagesColors[
                                    project.currentStage
                                  ]
                                : "black",
                          }}
                        />
                        <Typography sx={{ fontSize: 13 }}>
                          {project.stages.length > project.currentStage
                            ? `${project.stages[project.currentStage].title}
                                  (${project.currentStage + 1}/${
                                project.stages.length
                              })`
                            : "Resolvido"}
                        </Typography>
                      </Grid>
                    </TableCell>
                    <TableCell
                      onClick={() => handleOpenDetail(project)}
                      cursor="pointer"
                      align="center"
                    >
                      <Typography sx={{ fontSize: 13 }}>
                        {project.creator.name}
                      </Typography>
                    </TableCell>
                    <TableCell
                      onClick={() => handleOpenDetail(project)}
                      cursor="pointer"
                      align="center"
                    >
                      <Typography sx={{ fontSize: 13 }}>
                        {project.status}
                      </Typography>
                    </TableCell>
                    <TableCell
                      cursor="pointer"
                      align="center"
                      onClick={() => setSelectedProject(project)}
                    >
                      <ProjectTableActions
                        selectedItem={project}
                        configCustomization={"configCustomization"}
                        handleOpenAddAttachment={setOpenAddAttachments}
                        refreshData={refreshData}
                        setRefreshData={setRefreshData}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={8}
                    >
                      <Collapse
                        in={openDetail && selectedProject._id === project._id}
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
                              Informações do Projeto
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
                                  <TableCell sx={{ width: "350px" }}>
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
                                    >
                                      Nome
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
                                    >
                                      ####
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableRow>
                                  <TableCell sx={{ width: "350px" }}>
                                    <Typography sx={{ fontSize: 13 }}>
                                      {project.name}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography sx={{ fontSize: 13 }}>
                                      ####
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                            {project.attachments.length !== 0 && (
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
                                        {project.attachments.map(
                                          (attachment, index) => (
                                            <Grid
                                              key={index}
                                              item
                                              sx={{ mr: 1 }}
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
                                                        project._id,
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
                              Etapas
                            </Typography>
                            <IconButton
                              onClick={() =>
                                setOpenDetailStages(!openDetailStages)
                              }
                            >
                              <ExpandMoreIcon />
                            </IconButton>
                          </Grid>
                          <Collapse
                            in={openDetailStages}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Grid container direction="column">
                              {project.stages.map((stage, stageIndex) => (
                                <Accordion
                                  key={stageIndex}
                                  onClick={() =>
                                    setSelectedStageIndex(stageIndex)
                                  }
                                  sx={{ mx: "10%", mb: 1 }}
                                >
                                  <AccordionSummary
                                    expandIcon={<ArrowDropDownIcon />}
                                  >
                                    <Grid
                                      container
                                      direction="row"
                                      justifyContent="space-between"
                                    >
                                      <Grid item sx={{ width: 200 }}>
                                        <Grid container direction="row">
                                          <Grid
                                            sx={{
                                              width: 24,
                                              height: 24,
                                              borderRadius: 100,
                                              mr: 1,
                                              backgroundColor:
                                                project.definedStagesColors[
                                                  stageIndex
                                                ],
                                            }}
                                          />
                                          <Typography
                                            sx={{
                                              fontSize: 16,
                                              mt: 0.5,
                                              fontWeight: "bold",
                                            }}
                                          >
                                            {stage.title === "" ? (
                                              <Typography sx={{ fontSize: 14 }}>
                                                Etapa #{stageIndex + 1}
                                              </Typography>
                                            ) : (
                                              <Typography sx={{ fontSize: 14 }}>
                                                {stage.title}
                                              </Typography>
                                            )}
                                          </Typography>
                                        </Grid>
                                      </Grid>

                                      <Typography
                                        sx={{
                                          fontSize: 14,
                                        }}
                                      >
                                        {stageIndex > 0 &&
                                        project.stages[stageIndex - 1]
                                          .status === "Aberto" &&
                                        stage.status === "Aberto"
                                          ? "Aguardando"
                                          : stage.status}
                                      </Typography>

                                      <Typography
                                        sx={{
                                          fontSize: 14,
                                          mr: 1,
                                        }}
                                      >
                                        Prazo de Execução:{" "}
                                        {dayjs(stage.dueTo).format(
                                          "DD/MM/YYYY"
                                        )}
                                      </Typography>
                                    </Grid>
                                  </AccordionSummary>
                                  <AccordionDetails>
                                    <Typography
                                      sx={{
                                        fontSize: 16,
                                        mx: 2,
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Tarefas
                                    </Typography>
                                    {stage.tasks.map((task, taskIndex) => (
                                      <>
                                        <Accordion
                                          key={taskIndex}
                                          onClick={() => {
                                            setSelectedTaskIndex(taskIndex);
                                            setSelectedStageIndex(stageIndex);
                                          }}
                                        >
                                          <AccordionSummary>
                                            <Grid
                                              key={taskIndex}
                                              container
                                              direction="row"
                                              alignItems="center"
                                              justifyContent="flex-start"
                                            >
                                              <Grid item>{taskIndex + 1}.</Grid>
                                              <Grid item sx={{ width: "25%" }}>
                                                <Typography
                                                  sx={{ fontSize: 14 }}
                                                >
                                                  Tarefa: {task.title}
                                                </Typography>
                                              </Grid>
                                              <Grid item sx={{ width: "30%" }}>
                                                <Grid container direction="row">
                                                  <Typography
                                                    sx={{
                                                      fontSize: 14,
                                                      mr: 1,
                                                    }}
                                                  >
                                                    Designados:
                                                  </Typography>
                                                  {task.assignees.map(
                                                    (assignee) => (
                                                      <Tooltip
                                                        key
                                                        title={
                                                          <Typography>
                                                            {assignee.name}
                                                          </Typography>
                                                        }
                                                      >
                                                        <Avatar
                                                          alt="Imagem do Colaborador"
                                                          src={`http://localhost:3000/static/${assignee.image}`}
                                                          sx={{
                                                            width: 22,
                                                            height: 22,
                                                          }}
                                                        />
                                                      </Tooltip>
                                                    )
                                                  )}
                                                </Grid>
                                              </Grid>
                                              <Grid item sx={{ width: "20%" }}>
                                                <Typography
                                                  sx={{ fontSize: 14 }}
                                                >
                                                  Status:{task.status}
                                                </Typography>
                                              </Grid>
                                              <Grid item sx={{ width: "15%" }}>
                                                <Typography
                                                  sx={{ fontSize: 14 }}
                                                >
                                                  Prazo: {task.dueTo}
                                                </Typography>
                                              </Grid>
                                            </Grid>
                                          </AccordionSummary>
                                          <AccordionDetails
                                            sx={{
                                              m: 2,
                                              border: "1px solid #bbb",
                                              borderRadius: 1,
                                            }}
                                          >
                                            <Typography
                                              sx={{
                                                fontSize: 16,
                                                fontWeight: "bold",
                                              }}
                                            >
                                              Atividades
                                            </Typography>
                                            <Grid sx={{ ml: 2 }}>
                                              {task.interactions.length ===
                                              0 ? (
                                                "Não há Atividades na Tarefa"
                                              ) : (
                                                <Table size="small">
                                                  <TableHead>
                                                    <TableRow>
                                                      <TableCell>
                                                        <Typography
                                                          sx={{
                                                            fontSize: 13,
                                                            color: "#777",
                                                          }}
                                                        >
                                                          Colaborador
                                                        </Typography>
                                                      </TableCell>
                                                      <TableCell>
                                                        <Typography
                                                          sx={{
                                                            fontSize: 13,
                                                            color: "#777",
                                                          }}
                                                        >
                                                          Atividade
                                                        </Typography>
                                                      </TableCell>
                                                      <TableCell>
                                                        <Typography
                                                          sx={{
                                                            fontSize: 13,
                                                            color: "#777",
                                                          }}
                                                        >
                                                          Anexos
                                                        </Typography>
                                                      </TableCell>
                                                      <TableCell>
                                                        <Typography
                                                          sx={{
                                                            fontSize: 13,
                                                            color: "#777",
                                                          }}
                                                        >
                                                          Data
                                                        </Typography>
                                                      </TableCell>
                                                      <TableCell>
                                                        <Typography
                                                          sx={{
                                                            fontSize: 13,
                                                            color: "#777",
                                                          }}
                                                        >
                                                          Reações
                                                        </Typography>
                                                      </TableCell>
                                                    </TableRow>
                                                  </TableHead>
                                                  <TableBody>
                                                    {task.interactions.map(
                                                      (
                                                        interaction,
                                                        interactionIndex
                                                      ) => (
                                                        <TableRow
                                                          key={interactionIndex}
                                                        >
                                                          <TableCell align="left">
                                                            <Typography
                                                              sx={{
                                                                fontSize: 13,
                                                              }}
                                                            >
                                                              {
                                                                interaction.user
                                                                  .name
                                                              }
                                                            </Typography>
                                                          </TableCell>
                                                          <TableCell align="left">
                                                            <Typography
                                                              sx={{
                                                                fontSize: 13,
                                                              }}
                                                            >
                                                              {
                                                                interaction.interaction
                                                              }
                                                            </Typography>
                                                          </TableCell>
                                                          <TableCell align="left">
                                                            {/* here */}
                                                            {interaction
                                                              .attachments
                                                              .length !== 0 && (
                                                              <Grid>
                                                                <AttachFileIcon
                                                                  sx={{
                                                                    fontSize: 16,
                                                                    color:
                                                                      "#777",
                                                                    cursor:
                                                                      "pointer",
                                                                  }}
                                                                  onClick={handlePopoverOpen(
                                                                    interactionIndex
                                                                  )}
                                                                />
                                                                {openPopoverIndex ===
                                                                  interactionIndex && (
                                                                  <Popover
                                                                    open={Boolean(
                                                                      anchorEl
                                                                    )}
                                                                    anchorEl={
                                                                      anchorEl
                                                                    }
                                                                    onClose={
                                                                      handlePopoverClose
                                                                    }
                                                                    anchorOrigin={{
                                                                      vertical:
                                                                        "bottom",
                                                                      horizontal:
                                                                        "left",
                                                                    }}
                                                                  >
                                                                    <Box
                                                                      p={2}
                                                                      sx={{
                                                                        width:
                                                                          "auto",
                                                                        maxWidth: 460,
                                                                        height:
                                                                          "auto",
                                                                        maxHeight: 280,
                                                                      }}
                                                                    >
                                                                      <Typography
                                                                        variant="h6"
                                                                        sx={{
                                                                          color:
                                                                            "#555",
                                                                        }}
                                                                      >
                                                                        Anexos
                                                                      </Typography>
                                                                      <Grid
                                                                        container
                                                                        direction="row"
                                                                      >
                                                                        {interaction.attachments.map(
                                                                          (
                                                                            attachment,
                                                                            attachmentIndex
                                                                          ) => (
                                                                            <Grid
                                                                              key={
                                                                                attachmentIndex
                                                                              }
                                                                              sx={{
                                                                                mr: 2,
                                                                                mb: 2,
                                                                                cursor:
                                                                                  "pointer",
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
                                                                              {isPdf(
                                                                                attachment
                                                                              ) ? (
                                                                                <img
                                                                                  src={`http://localhost:3000/static/pdf.png`}
                                                                                  alt="PDF"
                                                                                  style={{
                                                                                    width:
                                                                                      "80px",
                                                                                    height:
                                                                                      "80px",
                                                                                    marginBottom:
                                                                                      "8px",
                                                                                  }}
                                                                                />
                                                                              ) : isImage(
                                                                                  attachment
                                                                                ) ? (
                                                                                <img
                                                                                  src={`http://localhost:3000/static/${attachment}`}
                                                                                  alt="Pré-visualização"
                                                                                  style={{
                                                                                    width:
                                                                                      "80px",
                                                                                    height:
                                                                                      "80px",
                                                                                    marginBottom:
                                                                                      "8px",
                                                                                  }}
                                                                                />
                                                                              ) : (
                                                                                <img
                                                                                  src={`http://localhost:3000/static/doc.png`}
                                                                                  alt="Other"
                                                                                  style={{
                                                                                    width:
                                                                                      "80px",
                                                                                    height:
                                                                                      "80px",
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
                                                            <Typography
                                                              sx={{
                                                                fontSize: 13,
                                                              }}
                                                            >
                                                              {
                                                                interaction.createdAt
                                                              }
                                                            </Typography>
                                                          </TableCell>
                                                          <TableCell align="left">
                                                            {interaction.activity !==
                                                              "Job aprovado" && (
                                                              <Typography
                                                                sx={{
                                                                  fontSize: 13,
                                                                }}
                                                              >
                                                                <InteractionReactions
                                                                  fromProjects
                                                                  userId={
                                                                    userId
                                                                  }
                                                                  userName={
                                                                    userName
                                                                  }
                                                                  refreshData={
                                                                    refreshData
                                                                  }
                                                                  setRefreshData={
                                                                    setRefreshData
                                                                  }
                                                                  interaction={
                                                                    interaction
                                                                  }
                                                                  stageIndex={
                                                                    stageIndex
                                                                  }
                                                                  taskIndex={
                                                                    taskIndex
                                                                  }
                                                                  interactionIndex={
                                                                    interactionIndex
                                                                  }
                                                                  number={
                                                                    interaction.number
                                                                  }
                                                                  userReactions={
                                                                    userReactions[
                                                                      selectedProject
                                                                        ._id
                                                                    ] || []
                                                                  }
                                                                  setUserReactions={(
                                                                    reactions
                                                                  ) =>
                                                                    setUserReactions(
                                                                      {
                                                                        ...userReactions,
                                                                        [selectedProject._id]:
                                                                          reactions,
                                                                      }
                                                                    )
                                                                  }
                                                                  itemId={
                                                                    selectedProject._id
                                                                  }
                                                                  updateInteractions={
                                                                    updateSelectedProjectInteractions
                                                                  }
                                                                />
                                                              </Typography>
                                                            )}
                                                          </TableCell>
                                                        </TableRow>
                                                      )
                                                    )}
                                                  </TableBody>
                                                </Table>
                                              )}
                                            </Grid>

                                            {task.status === "Resolvido" && (
                                              <Grid sx={{ mt: 3 }}>
                                                <Typography
                                                  sx={{
                                                    fontSize: 16,
                                                    fontWeight: "bold",
                                                  }}
                                                >
                                                  Resolução
                                                </Typography>
                                                <Table
                                                  size="small"
                                                  sx={{ ml: 2 }}
                                                >
                                                  <TableHead>
                                                    <TableRow>
                                                      <TableCell>
                                                        <Typography
                                                          sx={{
                                                            fontSize: 13,
                                                            color: "#777",
                                                          }}
                                                        >
                                                          Data
                                                        </Typography>
                                                      </TableCell>
                                                      <TableCell>
                                                        <Typography
                                                          sx={{
                                                            fontSize: 13,
                                                            color: "#777",
                                                          }}
                                                        >
                                                          Colaborador
                                                        </Typography>
                                                      </TableCell>

                                                      <TableCell>
                                                        <Typography
                                                          sx={{
                                                            fontSize: 13,
                                                            color: "#777",
                                                          }}
                                                        >
                                                          Resolução
                                                        </Typography>
                                                      </TableCell>
                                                    </TableRow>
                                                  </TableHead>
                                                  <TableBody>
                                                    <TableRow>
                                                      <TableCell>
                                                        <Typography
                                                          sx={{
                                                            fontSize: 13,
                                                          }}
                                                        >
                                                          {
                                                            task.resolution[0]
                                                              .createdAt
                                                          }
                                                        </Typography>
                                                      </TableCell>
                                                      <TableCell>
                                                        <Typography
                                                          sx={{
                                                            fontSize: 13,
                                                          }}
                                                        >
                                                          {
                                                            task.resolution[0]
                                                              .user.name
                                                          }
                                                        </Typography>
                                                      </TableCell>
                                                      <TableCell>
                                                        <Typography
                                                          sx={{
                                                            fontSize: 13,
                                                          }}
                                                        >
                                                          {
                                                            task.resolution[0]
                                                              .resolution
                                                          }
                                                        </Typography>
                                                      </TableCell>
                                                    </TableRow>
                                                  </TableBody>
                                                </Table>
                                              </Grid>
                                            )}
                                          </AccordionDetails>

                                          {isAddingInteraction &&
                                            selectedTaskIndex === taskIndex &&
                                            selectedStageIndex ===
                                              stageIndex && (
                                              <>
                                                <Typography
                                                  sx={{
                                                    m: 3,
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
                                                    value={newInteractionText}
                                                    onChange={(e) =>
                                                      setNewInteractionText(
                                                        e.target.value
                                                      )
                                                    }
                                                  />
                                                  <input
                                                    type="file"
                                                    multiple
                                                    id="fileInput"
                                                    style={{
                                                      display: "none",
                                                    }}
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
                                                      <Grid
                                                        container
                                                        direction="row"
                                                      >
                                                        {attachments.map(
                                                          (
                                                            attachment,
                                                            index
                                                          ) => (
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
                                                                {isPdf(
                                                                  attachment.name
                                                                ) ? (
                                                                  <img
                                                                    src={`http://localhost:3000/static/pdf.png`}
                                                                    alt="PDF"
                                                                    style={{
                                                                      width:
                                                                        "80px",
                                                                      height:
                                                                        "80px",
                                                                      marginBottom:
                                                                        "8px",
                                                                    }}
                                                                  />
                                                                ) : isImage(
                                                                    attachment.name
                                                                  ) ? (
                                                                  <img
                                                                    src={URL.createObjectURL(
                                                                      attachment
                                                                    )}
                                                                    alt="Pré-visualização"
                                                                    style={{
                                                                      width:
                                                                        "80px",
                                                                      height:
                                                                        "80px",
                                                                      marginBottom:
                                                                        "8px",
                                                                    }}
                                                                  />
                                                                ) : (
                                                                  <img
                                                                    src={`http://localhost:3000/static/doc.png`}
                                                                    alt="Other"
                                                                    style={{
                                                                      width:
                                                                        "80px",
                                                                      height:
                                                                        "80px",
                                                                      marginBottom:
                                                                        "8px",
                                                                    }}
                                                                  />
                                                                )}
                                                                <Typography
                                                                  sx={{
                                                                    fontSize: 10,
                                                                    color:
                                                                      "#777",
                                                                    maxWidth:
                                                                      "75px",
                                                                    whiteSpace:
                                                                      "nowrap",
                                                                    overflow:
                                                                      "hidden",
                                                                    textOverflow:
                                                                      "ellipsis",
                                                                  }}
                                                                >
                                                                  {
                                                                    attachment.name
                                                                  }
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
                                                                        removeFile(
                                                                          index
                                                                        )
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
                                              </>
                                            )}
                                          {isAddingResolution && (
                                            <>
                                              <Typography
                                                sx={{
                                                  m: 2,
                                                  fontSize: 16,
                                                  fontWeight: "bold",
                                                }}
                                              >
                                                Resolver Tarefa
                                              </Typography>
                                              <Grid
                                                container
                                                direction="row"
                                                alignItems="center"
                                                justifyContent="flex-start"
                                                sx={{
                                                  m: 2,
                                                  ml: 10,
                                                }}
                                              >
                                                <Grid item>
                                                  <Avatar
                                                    alt="Imagem do Colaborador"
                                                    src={`http://localhost:3000/static/${userImage}`}
                                                    sx={{
                                                      mx: 2,
                                                      width: 36,
                                                      height: 36,
                                                    }}
                                                  />
                                                </Grid>
                                                <Grid item>
                                                  <TextField
                                                    size="small"
                                                    onChange={(e) =>
                                                      setResolutionText(
                                                        e.target.value
                                                      )
                                                    }
                                                    placeholder="Insira a resolução da tarefa..."
                                                    sx={{
                                                      width: 750,
                                                      backgroundColor: "white",
                                                    }}
                                                  />
                                                </Grid>
                                              </Grid>
                                            </>
                                          )}
                                          {task.status !== "Resolvido" &&
                                            selectedTaskIndex === taskIndex &&
                                            selectedStageIndex ===
                                              stageIndex && (
                                              <AccordionActions>
                                                <ProjectTaskActions
                                                  task={task}
                                                  selectedTaskIndex={
                                                    selectedTaskIndex
                                                  }
                                                  taskIndex={taskIndex}
                                                  isAddingInteraction={
                                                    isAddingInteraction
                                                  }
                                                  setIsAddingInteraction={
                                                    setIsAddingInteraction
                                                  }
                                                  handleAddInteraction={
                                                    handleAddInteraction
                                                  }
                                                  isAddingResolution={
                                                    isAddingResolution
                                                  }
                                                  setIsAddingResolution={
                                                    setIsAddingResolution
                                                  }
                                                  handleResolveTask={
                                                    handleResolveTask
                                                  }
                                                />
                                              </AccordionActions>
                                            )}
                                        </Accordion>
                                      </>
                                    ))}
                                  </AccordionDetails>
                                </Accordion>
                              ))}
                            </Grid>
                          </Collapse>
                        </Box>
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
      {openAddAttachments && (
        <Dialog
          fullWidth
          maxWidth="md"
          open={openAddAttachments}
          onClose={() => setOpenAddAttachments(!openAddAttachments)}
        >
          <AddAttachmentsForm
            userName={userName}
            selectedJob={selectedProject}
            setOpenAddAttachments={setOpenAddAttachments}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            toast={toast}
            endpoint="projects"
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
            setOpenViewDialog={setOpenViewDialog2}
            selectedItem={selectedItem.name}
            createObjectURLItem={selectedItem}
            createObjectURL
          />
        </Dialog>
      )}
    </Box>
  );
}
