/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import dayjs from "dayjs";

import {
  TextField,
  Avatar,
  IconButton,
  Typography,
  Grid,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Badge,
  Popover,
  Tooltip,
  Box,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SellIcon from "@mui/icons-material/Sell";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import ProjectStageTaskMembers from "./ProjectStageTaskMembers";
import MultipleServicesSelect from "./selects/MultipleServicesSelect";
import MaterialList from "./MaterialList";
import MultipleProductsSelect from "./selects/MultipleProductsSelect";

const ProjectStageTasks = ({
  members,
  stages,
  services,
  products,
  definedStagesColors,
  addTaskFromParent,
}) => {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskAssignees, setNewTaskAssignees] = useState([]);
  const [newTaskServices, setNewTaskServices] = useState([]);
  const [newTaskProducts, setNewTaskProducts] = useState([]);
  const [newTaskDueTo, setNewTaskDueTo] = useState(dayjs());
  const [materialsCost, setMaterialsCost] = React.useState(0);
  const [openedPopoverIndex, setOpenedPopoverIndex] = useState(null);
  const [anchorElArray, setAnchorElArray] = useState([]);
  const [openedPopoverServicesIndex, setOpenedPopoverServicesIndex] =
    useState(null);
  const [anchorElServicesArray, setAnchorElServicesArray] = useState([]);
  const [openedPopoverProductsIndex, setOpenedPopoverProductsIndex] =
    useState(null);
  const [anchorElProductsArray, setAnchorElProductsArray] = useState([]);

  const addTask = (stageIndex) => {
    const newTask = {
      title: newTaskTitle,
      assignees: newTaskAssignees,
      services: newTaskServices,
      products: newTaskProducts,
      dueTo: newTaskDueTo.format("DD/MM/YYYY"),
      status: "Aberto",
      interactions: []
    };

    addTaskFromParent(stageIndex, newTask);

    setNewTaskTitle("");
    setNewTaskAssignees([]);
    setNewTaskProducts([]);
    setNewTaskServices([]);
    setNewTaskDueTo(dayjs());
  };

  const handleClick = (event, index) => {
    const newAnchorElArray = [...anchorElArray];
    newAnchorElArray[index] = event.currentTarget;
    setAnchorElArray(newAnchorElArray);
    setOpenedPopoverIndex(index);
  };

  const handleClickServices = (event, index) => {
    const newAnchorElServicesArray = [...anchorElServicesArray];
    newAnchorElServicesArray[index] = event.currentTarget;
    setAnchorElServicesArray(newAnchorElServicesArray);
    setOpenedPopoverServicesIndex(index);
  };

  const handleClickProducts = (event, index) => {
    const newAnchorElProductsArray = [...anchorElProductsArray];
    newAnchorElProductsArray[index] = event.currentTarget;
    setAnchorElProductsArray(newAnchorElProductsArray);
    setOpenedPopoverProductsIndex(index);
  };

  const handleClose = () => {
    setAnchorElArray([]);
    setAnchorElServicesArray([]);
    setAnchorElProductsArray([]);
    setSelectedTask(null);
    setPopoverAnchorEl(null);
    setOpenedPopoverIndex(null);
  };

  const [selectedTask, setSelectedTask] = useState(null);
  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);

  const handlePopoverOpen = (event, index) => {
    setPopoverAnchorEl(event.currentTarget);
    setSelectedTask(index);
  };

  const handlePopoverClose = () => {
    setPopoverAnchorEl(null);
    setSelectedTask(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid
        container
        direction="row"
        alignItems="center"
        justifyContent="center"
      >
        {stages.map((stage, index) => (
          <Grid
            xs={1}
            item
            container
            alignItems="center"
            justifyContent="center"
            key={index}
            sx={{
              my: 3,
              mx: 10,
              cursor: "pointer",
              borderRadius: 100,
              border: "1px solid #bbb",
              height: 90,
              backgroundColor: definedStagesColors[index],
            }}
            onClick={(e) => handlePopoverOpen(e, index)}
          >
            <Typography sx={{ fontSize: 16 }}>
              {stage.title || `Etapa #${index + 1}`}
            </Typography>

            <Popover
              open={selectedTask === index}
              anchorEl={popoverAnchorEl}
              onClose={handlePopoverClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
            >
              <Typography
                sx={{
                  fontSize: 16,
                  mt: 4,
                  mb: 2,
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                Tarefas da Etapa {stage.title || `#${index + 1}`}
              </Typography>
              <Grid
                container
                direction="row"
                justifyContent="center"
                sx={{ m: 2 }}
              >
                <TextField
                  label="Nova Tarefa"
                  variant="outlined"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                />
                <ProjectStageTaskMembers
                  members={members}
                  setNewTaskAssignees={setNewTaskAssignees}
                  allocatedMembersForTask={newTaskAssignees}
                  index={index}
                  title={newTaskTitle}
                  openedPopoverIndex={openedPopoverIndex}
                  anchorElArray={anchorElArray}
                  handleClick={handleClick}
                  handleClose={handleClose}
                  sx={{ mx: 2 }}
                />
                <MultipleServicesSelect
                  services={services}
                  handleClickServices={handleClickServices}
                  openedPopoverServicesIndex={openedPopoverServicesIndex}
                  index={index}
                  handleClose={handleClose}
                  anchorElArray={anchorElServicesArray}
                  allocatedServicesForTask={newTaskServices}
                  setNewTaskServices={(selectedServices) =>
                    setNewTaskServices(selectedServices, index)
                  }
                />

                <>
                  <Tooltip
                    title={
                      <Typography sx={{ fontSize: 12 }}>Produtos</Typography>
                    }
                  >
                    <Badge
                      key
                      color={newTaskProducts.length === 0 ? "error" : "success"}
                      overlap="circular"
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      variant="dot"
                    >
                      <Avatar sx={{ my: "auto", ml: 1, width: 32, height: 32 }}>
                        <IconButton
                          onClick={(event) => handleClickProducts(event, index)}
                        >
                          <SellIcon sx={{ color: "white" }} />
                        </IconButton>{" "}
                      </Avatar>
                    </Badge>
                  </Tooltip>

                  <Popover
                    elevation={0}
                    open={
                      openedPopoverProductsIndex === index &&
                      anchorElProductsArray[index] !== undefined
                    }
                    anchorEl={anchorElArray[index]}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "center",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "center",
                    }}
                    disableRestoreFocus
                  >
                    <Grid
                      sx={{
                        p: 2,
                        border: "1px solid #bbb",
                        borderRadius: 2,
                      }}
                    >
                      <MaterialList
                        option="project"
                        handleClose={handleClose}
                        stockItems={products}
                        materials={newTaskProducts}
                        materialsEditCost={""}
                        setMaterials={setNewTaskProducts}
                        setMaterialsFinalCost={setMaterialsCost}
                      />
                    </Grid>
                  </Popover>
                </>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    sx={{ width: 150, mx: 1 }}
                    label="Término"
                    value={newTaskDueTo}
                    format="DD/MM/YYYY"
                    onChange={(date) => setNewTaskDueTo(date)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  sx={{ my: "auto", mr: 1 }}
                  disabled={
                    newTaskAssignees.length === 0 || newTaskTitle === ""
                  }
                  onClick={() => addTask(index)}
                >
                  + Adicionar
                </Button>
              </Grid>
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                <Table sx={{ width: "90%", mb: 1 }} size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">#</TableCell>
                      <TableCell align="left">Tarefa</TableCell>
                      <TableCell align="center">Designados</TableCell>
                      <TableCell align="center">Serviços</TableCell>
                      <TableCell align="center">Produtos</TableCell>
                      <TableCell align="right">Conclusão</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stages[index].tasks?.map((task, taskIndex) => (
                      <TableRow
                        key={taskIndex}
                        sx={{
                          backgroundColor:
                            taskIndex % 2 === 0 ? "white" : "lightgrey",
                        }}
                      >
                        <TableCell align="left">{taskIndex + 1}</TableCell>

                        <TableCell align="left">
                          <Typography sx={{ fontSize: 13 }}>
                            {task.title}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Grid
                            container
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                          >
                            {task.assignees.map((assignee, assigneeIndex) => (
                              <Avatar
                                key={assigneeIndex}
                                alt={assignee.name}
                                src={`http://localhost:3000/static/${assignee.image}`}
                                sx={{ width: 24, height: 24, mx: 1 }}
                              />
                            ))}
                          </Grid>
                        </TableCell>
                        <TableCell align="center">
                          <Typography sx={{ fontSize: 13 }}>
                            {task.services.map((service) => (
                              <Typography key sx={{ fontSize: 13, mr: 1 }}>
                                {service.name}
                              </Typography>
                            ))}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography sx={{ fontSize: 13 }}>
                            {task.products.map((product) => (
                              <Typography key sx={{ fontSize: 13, mr: 1 }}>
                                {product.name} x{product.quantity}
                              </Typography>
                            ))}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography sx={{ fontSize: 13 }}>
                            {task.dueTo}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Grid>
              <Typography
                sx={{
                  fontSize: 14,
                  mt: 4,
                  mb: 2,
                  textAlign: "center",
                  color: "#666",
                }}
              >
                * Pressione a tecla <strong>ESC</strong> para fechar *
              </Typography>
            </Popover>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProjectStageTasks;
