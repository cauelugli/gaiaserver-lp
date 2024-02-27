/* eslint-disable no-unused-vars */
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
  Collapse,
  Dialog,
  Grid,
  IconButton,
  Paper,
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

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import GenericDeleteForm from "../forms/delete/GenericDeleteForm";
import ProjectTaskActions from "../components/small/buttons/ProjectTaskActions";
import ProjectTableActions from "../components/small/buttons/tableActionButtons/ProjectTableActions";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const socket = io("http://localhost:3000");

export default function ProjectsTable({
  user,
  searchValue,
  searchOption,
  projects,
  refreshData,
  setRefreshData,
}) {
  const [selectedProject, setSelectedProject] = React.useState("");
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDetail, setOpenDetail] = React.useState(false);
  const [openDetailInfo, setOpenDetailInfo] = React.useState(true);
  const [openDetailStages, setOpenDetailStages] = React.useState(true);
  const [selectedItem, setSelectedItem] = React.useState("");
  const [openDialog, setOpenDialog] = React.useState(false);
  const [isAddingInteraction, setIsAddingInteraction] = React.useState(false);

  const [newInteractionText, setNewInteractionText] = React.useState("");
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
      const response = await api.post("/projects/addInteraction", {
        projectId: selectedProject._id,
        stageIndex: selectedStageIndex,
        taskIndex: selectedTaskIndex,
        interaction: newInteractionText,
        user: { id: user._id, name: user.name },
        createdAt: dayjs().format("DD/MM/YYYY"),
      });

      if (response.status === 200) {
        setNewInteractionText("");
        setSelectedTaskIndex(null);
        setSelectedStageIndex(null);
        setIsAddingInteraction(false);
        setRefreshData(!refreshData);
        const memberIds = response.data.stages[selectedStageIndex].tasks[
          selectedTaskIndex
        ].assignees.map((assignee) => assignee.id);
        socket.emit("notifyTaskAssignees", {
          sender: user.name,
          list: memberIds,
          date: dayjs(Date.now()).format("DD/MM/YYYY"),
          projectName: selectedProject.name,
        });
      } else {
        console.error("Erro ao adicionar interação:", response.status);
      }
    } catch (error) {
      console.error("Erro ao adicionar interação:", error);
    }
  };

  return (
    <>
      <Box sx={{ minWidth: "1250px" }}>
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
                .filter((user) =>
                  user[searchOption]
                    .toLowerCase()
                    .includes(searchValue.toLowerCase())
                )
                .map((project) => (
                  <>
                    <TableRow
                      key={project._id}
                      sx={{
                        cursor: "pointer",
                        backgroundColor:
                          selectedProject._id === project._id && openDetail
                            ? "#eee"
                            : "none",
                        "&:hover": { backgroundColor: "#eee " },
                      }}
                    >
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
                            {project.stages[project.currentStage].title} (
                            {project.currentStage + 1}/{project.stages.length})
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
                      <TableCell cursor="pointer" align="center">
                        <ProjectTableActions
                          configCustomization={"configCustomization"}
                          selectedItem={project}
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
                                onClick={() =>
                                  setOpenDetailInfo(!openDetailInfo)
                                }
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
                                {project.stages.map((stage, index) => (
                                  <Accordion
                                    key={index}
                                    onClick={() => setSelectedStageIndex(index)}
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
                                                    index
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
                                                <Typography
                                                  sx={{ fontSize: 14 }}
                                                >
                                                  Etapa #{index + 1}
                                                </Typography>
                                              ) : (
                                                <Typography
                                                  sx={{ fontSize: 14 }}
                                                >
                                                  {stage.title}
                                                </Typography>
                                              )}{" "}
                                            </Typography>
                                          </Grid>
                                        </Grid>

                                        <Typography
                                          sx={{
                                            fontSize: 14,
                                          }}
                                        >
                                          {index > 0 &&
                                          project.stages[index - 1].status ===
                                            "Aberto" &&
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
                                      {stage.tasks.map((task, index) => (
                                        <>
                                          <Accordion
                                            key={index}
                                            onClick={() =>
                                              setSelectedTaskIndex(index)
                                            }
                                            sx={{
                                              backgroundColor:
                                                index % 2
                                                  ? "lightgrey"
                                                  : "white",
                                            }}
                                          >
                                            <AccordionSummary
                                              sx={{
                                                backgroundColor:
                                                  index % 2
                                                    ? "lightgrey"
                                                    : "white",
                                              }}
                                            >
                                              <Grid
                                                key={index}
                                                container
                                                direction="row"
                                                alignItems="center"
                                                justifyContent="flex-start"
                                              >
                                                <Grid item>{index + 1}.</Grid>
                                                <Grid
                                                  item
                                                  sx={{ width: "25%" }}
                                                >
                                                  <Typography
                                                    sx={{ fontSize: 14 }}
                                                  >
                                                    Tarefa: {task.title}
                                                  </Typography>
                                                </Grid>
                                                <Grid
                                                  item
                                                  sx={{ width: "30%" }}
                                                >
                                                  <Grid
                                                    container
                                                    direction="row"
                                                  >
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
                                                <Grid
                                                  item
                                                  sx={{ width: "20%" }}
                                                >
                                                  <Typography
                                                    sx={{ fontSize: 14 }}
                                                  >
                                                    Status:{task.status}
                                                  </Typography>
                                                </Grid>
                                                <Grid
                                                  item
                                                  sx={{ width: "15%" }}
                                                >
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
                                                backgroundColor: "white",
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
                                                            #
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
                                                      </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                      {task.interactions.map(
                                                        (
                                                          interaction,
                                                          index
                                                        ) => (
                                                          <TableRow
                                                            key={index}
                                                            sx={{
                                                              backgroundColor:
                                                                index % 2 === 0
                                                                  ? "#eee"
                                                                  : "white",
                                                            }}
                                                          >
                                                            <TableCell>
                                                              <Typography
                                                                sx={{
                                                                  fontSize: 13,
                                                                }}
                                                              >
                                                                {index + 1}
                                                              </Typography>
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
                                                              <Typography
                                                                sx={{
                                                                  fontSize: 13,
                                                                }}
                                                              >
                                                                {
                                                                  interaction
                                                                    .user.name
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
                                                          </TableRow>
                                                        )
                                                      )}
                                                    </TableBody>
                                                  </Table>
                                                )}
                                              </Grid>
                                            </AccordionDetails>
                                            {isAddingInteraction && (
                                              <>
                                                <Typography
                                                  sx={{
                                                    m: 2,
                                                    fontSize: 16,
                                                    fontWeight: "bold",
                                                  }}
                                                >
                                                  Nova Interação
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
                                                      src={`http://localhost:3000/static/${user.image}`}
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
                                                        setNewInteractionText(
                                                          e.target.value
                                                        )
                                                      }
                                                      placeholder="Insira as informações aqui..."
                                                      sx={{
                                                        width: 750,
                                                        backgroundColor:
                                                          "white",
                                                      }}
                                                    />
                                                  </Grid>
                                                </Grid>
                                              </>
                                            )}
                                            <AccordionActions>
                                              <ProjectTaskActions
                                                task={task}
                                                index={index}
                                                isAddingInteraction={
                                                  isAddingInteraction
                                                }
                                                setIsAddingInteraction={
                                                  setIsAddingInteraction
                                                }
                                                handleAddInteraction={
                                                  handleAddInteraction
                                                }
                                                handleResolveTask={
                                                  "handleResolveTask"
                                                }
                                              />
                                            </AccordionActions>
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
        {openDialog && (
          <Dialog open={openDialog} onClose={() => setOpenDialog(!openDialog)}>
            <GenericDeleteForm
              selectedItem={selectedItem}
              openDialog={openDialog}
              setOpenDialog={setOpenDialog}
              toast={toast}
              refreshData={refreshData}
              setRefreshData={setRefreshData}
              endpoint="projects"
              successMessage={`${
                selectedItem.name && selectedItem.name
              } Deletado com Sucesso`}
            />
          </Dialog>
        )}
      </Box>
    </>
  );
}
