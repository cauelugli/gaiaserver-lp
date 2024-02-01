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
  Collapse,
  Button,
  Divider,
  FormLabel,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Badge,
  Popover,
  Tooltip,
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
  const [expandedStage, setExpandedStage] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskAssignees, setNewTaskAssignees] = useState([]);
  const [newTaskServices, setNewTaskServices] = useState([]);
  const [newTaskProducts, setNewTaskProducts] = useState([]);
  const [newTaskDueTo, setNewTaskDueTo] = useState(dayjs());
  const [materialsCost, setMaterialsCost] = React.useState(0);

  const handleExpand = (stageIndex) => {
    setExpandedStage(expandedStage === stageIndex ? null : stageIndex);
  };

  const addTask = (stageIndex) => {
    const newTask = {
      title: newTaskTitle,
      assignees: newTaskAssignees,
      services: newTaskServices,
      products: newTaskProducts,
      dueTo: newTaskDueTo.format("DD/MM/YYYY"),
    };

    addTaskFromParent(stageIndex, newTask);

    setNewTaskTitle("");
    setNewTaskAssignees([]);
    setNewTaskProducts([]);
    setNewTaskServices([]);
    setNewTaskDueTo(dayjs());
  };

  const [openedPopoverIndex, setOpenedPopoverIndex] = useState(null);
  const [anchorElArray, setAnchorElArray] = useState([]);
  const [openedPopoverServicesIndex, setOpenedPopoverServicesIndex] =
    useState(null);
  const [anchorElServicesArray, setAnchorElServicesArray] = useState([]);
  const [openedPopoverProductsIndex, setOpenedPopoverProductsIndex] =
    useState(null);
  const [anchorElProductsArray, setAnchorElProductsArray] = useState([]);

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
    setOpenedPopoverIndex(null);
  };

  return (
    <>
      {stages.map((stage, index) => (
        <Grid
          key={index}
          sx={{
            mx: "10%",
            mb: 1,
            border: "1px solid #bbb",
            borderRadius: 2,
          }}
        >
          <Grid
            container
            direction="row"
            justifyContent="center"
            sx={{
              p: 2,
              cursor: "pointer",
              backgroundColor: definedStagesColors[index],
            }}
            onClick={() => handleExpand(index)}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: 18,
                my: "auto",
              }}
            >
              {stage.title || `Etapa #${index + 1}`}
              <IconButton sx={{ m: "auto" }}>
                <ExpandMoreIcon />
              </IconButton>
            </Typography>
            {expandedStage === index && <Divider sx={{ color: "lightgrey" }} />}
          </Grid>

          <Collapse in={expandedStage === index}>
            <Grid
              container
              direction="row"
              justifyContent="center"
              sx={{ my: 2 }}
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

              <Tooltip
                title={<Typography sx={{ fontSize: 12 }}>Produtos</Typography>}
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
                    </IconButton>
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
                        sx={{ p: 2, border: "1px solid #bbb", borderRadius: 2 }}
                      >
                        <MaterialList
                          option="project"
                          stockItems={products}
                          materials={newTaskProducts}
                          materialsEditCost={""}
                          setMaterials={setNewTaskProducts}
                          setMaterialsFinalCost={setMaterialsCost}
                        />
                      </Grid>
                    </Popover>
                  </Avatar>
                </Badge>
              </Tooltip>
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
                sx={{ my: "auto" }}
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
              <Table sx={{ width: "85%", mb: 1 }} size="small">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">#</TableCell>
                    <TableCell align="left">Tarefa</TableCell>
                    <TableCell align="center">Designados</TableCell>
                    <TableCell align="center">Serviços</TableCell>
                    <TableCell align="center">Produtos</TableCell>
                    <TableCell align="right">Prazo de Conclusão</TableCell>
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
          </Collapse>
        </Grid>
      ))}
    </>
  );
};

export default ProjectStageTasks;
