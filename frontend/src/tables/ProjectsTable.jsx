/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import * as React from "react";
import { toast } from "react-toastify";
import dayjs from "dayjs";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
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
  Typography,
} from "@mui/material";

import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import GenericDeleteForm from "../forms/delete/GenericDeleteForm";

export default function ProjectsTable({
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

  // const handleConfirmDelete = (position) => {
  //   setSelectedItem(position);
  //   setOpenDialog(true);
  // };

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
      id: "creator",
      label: "Criador",
    },
    {
      id: "status",
      label: "Status",
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
                          selectedProject.name === project.name && openDetail
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
                        <Typography sx={{ fontSize: 13 }}>Fase X/Y</Typography>
                      </TableCell>
                      <TableCell
                        onClick={() => handleOpenDetail(project)}
                        cursor="pointer"
                        align="center"
                      >
                        <Typography sx={{ fontSize: 13 }}>
                          {project.creator}
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
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={6}
                      >
                        <Collapse
                          in={
                            openDetail && selectedProject.name === project.name
                          }
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
                                        Valor do Plano
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
                                        R${project.value}
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
                                    sx={{ mx: "15%", mb: 1 }}
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
                                                  Etapa {stage.title}
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
                                      {stage.tasks.map((task, index) => (
                                        <>
                                          <Typography
                                            sx={{
                                              fontSize: 16,
                                              ml: 2,
                                              fontWeight: "bold",
                                            }}
                                          >
                                            Tarefas
                                          </Typography>
                                          <Grid
                                            key={index}
                                            sx={{ mx: "5%" }}
                                            spacing={3}
                                            container
                                            direction="row"
                                            alignItems="center"
                                            justifyContent="flex-start"
                                          >
                                            <Grid item sx={{ mr: -3 }}>
                                              {index + 1}.
                                            </Grid>
                                            <Grid item sx={{ width: "20%" }}>
                                              <Typography sx={{ fontSize: 13 }}>
                                                Tarefa: {task.title}
                                              </Typography>
                                            </Grid>
                                            <Grid
                                              item
                                              sx={{ mt: 0.5, width: "25%" }}
                                            >
                                              <Grid container direction="row">
                                                <Typography
                                                  sx={{ fontSize: 13, mr: 1 }}
                                                >
                                                  Designados:
                                                </Typography>
                                                {task.assignees.map(
                                                  (assignee) => (
                                                    <>
                                                      <Avatar
                                                        alt="Imagem do Colaborador"
                                                        src={`http://localhost:3000/static/${assignee.image}`}
                                                        sx={{
                                                          width: 22,
                                                          height: 22,
                                                        }}
                                                      />
                                                      <Typography
                                                        sx={{ fontSize: 13 }}
                                                      >
                                                        {assignee.name}
                                                      </Typography>
                                                    </>
                                                  )
                                                )}
                                              </Grid>
                                            </Grid>
                                            <Grid item sx={{ width: "15%" }}>
                                              <Typography sx={{ fontSize: 13 }}>
                                                Prazo: {task.dueTo}
                                              </Typography>
                                            </Grid>

                                            <Grid item sx={{ width: "10%" }}>
                                              <Typography sx={{ fontSize: 13 }}>
                                                Status:{task.status}
                                              </Typography>
                                            </Grid>
                                            <Grid item sx={{ width: "15%" }}>
                                              <Button
                                                variant="contained"
                                                size="small"
                                                onClick={() =>
                                                  alert(
                                                    `you chose ${task.title}`
                                                  )
                                                }
                                              >
                                                View title
                                              </Button>
                                            </Grid>
                                          </Grid>
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
