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
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import ProjectStageTaskMembers from "./ProjectStageTaskMembers";

const ProjectStageTasks = ({
  members,
  stages,
  definedStagesColors,
  addTaskFromParent,
}) => {
  const [expandedStage, setExpandedStage] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskAssignees, setNewTaskAssignees] = useState([]);
  const [newTaskDueTo, setNewTaskDueTo] = useState(dayjs());
  // const [tasks, setTasks] = useState(stages.map(() => []));

  const handleExpand = (stageIndex) => {
    setExpandedStage(expandedStage === stageIndex ? null : stageIndex);
  };

  const addTask = (stageIndex) => {
    const newTask = {
      title: newTaskTitle,
      assignees: newTaskAssignees,
      dueTo: newTaskDueTo.format("DD/MM/YYYY"),
    };

    addTaskFromParent(stageIndex, newTask);

    setNewTaskTitle("");
    setNewTaskAssignees([]);
    setNewTaskDueTo(dayjs());
  };

  const [openedPopoverIndex, setOpenedPopoverIndex] = useState(null);
  const [anchorElArray, setAnchorElArray] = useState([]);

  const handleClick = (event, index) => {
    const newAnchorElArray = [...anchorElArray];
    newAnchorElArray[index] = event.currentTarget;
    setAnchorElArray(newAnchorElArray);
    setOpenedPopoverIndex(index);
  };

  const handleClose = () => {
    setAnchorElArray([]);
    setOpenedPopoverIndex(null);
  };

  return (
    <>
      {stages.map((stage, index) => (
        <Grid
          key={index}
          sx={{
            mx: "20%",
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
                handleClick={handleClick}
                index={index}
                title={newTaskTitle}
                openedPopoverIndex={openedPopoverIndex}
                anchorElArray={anchorElArray}
                handleClose={handleClose}
              />

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
              <Table sx={{ width: "80%", mb: 1 }} size="small">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">#</TableCell>
                    <TableCell align="left">Tarefa</TableCell>
                    <TableCell align="center">Designados</TableCell>
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
