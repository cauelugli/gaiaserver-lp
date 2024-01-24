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
  Tooltip,
  Menu,
  Popover,
  Button,
  Divider,
  FormLabel,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import ProjectStageTaskMembers from "./ProjectStageTaskMembers";

const ProjectStageTasks = ({ members, stages, stagesColorSchema }) => {
  const [expandedStage, setExpandedStage] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskAssignees, setNewTaskAssignees] = useState([]);
  const [newTaskDueTo, setNewTaskDueTo] = useState(dayjs());
  const [tasks, setTasks] = useState(stages.map(() => []));

  const handleExpand = (stageIndex) => {
    setExpandedStage(expandedStage === stageIndex ? null : stageIndex);
  };

  const addTask = (stageIndex) => {
    const newTask = {
      title: newTaskTitle,
      assignees: newTaskAssignees,
      dueTo: newTaskDueTo.format("DD/MM/YYYY"),
    };

    const updatedTasks = [...tasks];
    updatedTasks[stageIndex].push(newTask);

    setTasks(updatedTasks);

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
          sx={{ mx: "20%", mb: 1, border: "1px solid #bbb", borderRadius: 2 }}
        >
          <Grid
            container
            direction="row"
            justifyContent="center"
            sx={{
              p: 2,
              cursor: "pointer",
            }}
            onClick={() => handleExpand(index)}
          >
            <Typography variant="h6" sx={{ fontSize: 18, my: "auto" }}>
              {stage.title || `Etapa #${index}`}
              <IconButton sx={{ m: "auto" }}>
                <ExpandMoreIcon />
              </IconButton>
            </Typography>
            {expandedStage === index && <Divider />}
          </Grid>

          <Collapse in={expandedStage === index}>
            <Grid
              container
              direction="row"
              justifyContent="center"
              sx={{ mb: 2 }}
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

            {tasks[index]?.map((task, taskIndex) => (
              <Grid
                container
                key={taskIndex}
                direction="row"
                justifyContent="center"
                alignItems="center"
                sx={{ ml: 4, width: "90%", mb: 0.5 }}
              >
                <Grid item sx={{ my: "auto" }}>
                  <Typography sx={{ color: "grey", fontWeight: "bold" }}>
                    {task.title}:
                  </Typography>
                </Grid>
                <Grid item sx={{ mx: 2 }}>
                  <Grid
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <FormLabel>
                      <Typography sx={{ fontSize: 12, color: "grey" }}>
                        Designados
                      </Typography>
                    </FormLabel>
                    {task.assignees.map((assignee, assigneeIndex) => (
                      <Avatar
                        key={assigneeIndex}
                        alt={assignee.name}
                        src={`http://localhost:3000/static/${assignee.image}`}
                        sx={{ width: 24, height: 24, mx: 1 }}
                      />
                    ))}
                  </Grid>
                </Grid>
                <Grid item>
                  <FormLabel>
                    <Typography sx={{ fontSize: 12, color: "grey" }}>
                      Prazo
                    </Typography>
                    <Typography sx={{ color: "grey", fontWeight: "bold" }}>
                      {task.dueTo}
                    </Typography>
                  </FormLabel>
                </Grid>
              </Grid>
            ))}
          </Collapse>
        </Grid>
      ))}
    </>
  );
};

export default ProjectStageTasks;
