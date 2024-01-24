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
  const [newTaskAssignee, setNewTaskAssignee] = useState([]);
  const [newTaskDueTo, setNewTaskDueTo] = useState(dayjs().add(2, "day"));
  const [tasks, setTasks] = useState([]);

  const handleExpand = (stageIndex) => {
    setExpandedStage(expandedStage === stageIndex ? null : stageIndex);
  };

  const addTask = (stageIndex) => {
    const stageTitle = stages[stageIndex].title;
    const newTask = {
      title: newTaskTitle,
      assigned: "", // You need to implement logic to assign a member
      dueTo: newTaskDueTo,
    };

    setTasks((prevTasks) => {
      const updatedTasks = [...prevTasks];
      updatedTasks[stageIndex] = updatedTasks[stageIndex] || [];
      updatedTasks[stageIndex].push(newTask);
      return updatedTasks;
    });

    console.log("Adding task for stage:", stageTitle, newTask);
    setNewTaskTitle("");
  };

  return (
    <>
      <Button onClick={() => console.log("stages", stages)}>stages pls</Button>
      {stages.map((stage, index) => (
        <>
          <Grid
            key={index}
            container
            direction="row"
            sx={{ p: 2, border: "1px solid #777", borderRadius: 1 }}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: 18,
                my: "auto",
              }}
              onClick={() => handleExpand(index)}
            >
              {stage.title || `Etapa #${index}`}
              {expandedStage === index ? (
                <IconButton sx={{ m: "auto" }}>
                  <ExpandLessIcon />
                </IconButton>
              ) : (
                <IconButton sx={{ m: "auto" }}>
                  <ExpandMoreIcon />
                </IconButton>
              )}
            </Typography>
          </Grid>

          <Collapse in={expandedStage === index}>
            {tasks[index]?.map((task, taskIndex) => (
              <div key={taskIndex}>
                <Typography>{task.title}</Typography>
                <Typography>Assigned to: {task.assigned}</Typography>
                <Typography>Due to: {task.dueTo}</Typography>
              </div>
            ))}

            <TextField
              label="Tarefa"
              variant="outlined"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Término"
                value={newTaskDueTo}
                format="DD/MM/YYYY"
                onChange={(date) => setNewTaskDueTo(date)}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>

            {/* Button to add a new task */}
            <Button
              variant="outlined"
              color="primary"
              onClick={() => addTask(index)}
            >
              Add Task
            </Button>
          </Collapse>
        </>
      ))}
    </>
  );
};

export default ProjectStageTasks;
