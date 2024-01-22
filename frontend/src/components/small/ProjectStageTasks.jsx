/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
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

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ProjectStageTaskMembers from "./ProjectStageTaskMembers";

const ProjectStageTasks = ({
  tasks,
  members,
  onAddTask,
  onUpdateTask,
  onClearTasks,
}) => {
  const [newTask, setNewTask] = useState({
    title: "",
    assignee: [],
    dueTo: "",
    status: "Não Executado",
  });
  const [expanded, setExpanded] = React.useState(false);

  const handleInputChange = (index, field, value) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = { ...updatedTasks[index], [field]: value };
    onUpdateTask(updatedTasks);
  };

  const handleAddTask = () => {
    onAddTask([...tasks, newTask]);
    setNewTask({
      title: "",
      assignee: [],
      dueTo: "",
      status: "Não Executado",
    });
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
      <Grid
        container
        direction="column"
        alignItems="flex-start"
        justifyContent="flex-start"
        sx={{ border: "1px solid #bbb", borderRadius: 1, width: 500, mt:1, mr:1 }}
      >
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          onClick={() => setExpanded(!expanded)}
        >
          <Typography sx={{ mr: 1, ml: 1.5, mt: 1.5, mb: 2, color: "#666" }}>
            Tarefas
          </Typography>
          <IconButton>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Grid>

        <Grid
          container
          direction="column"
          alignItems={tasks.length !== 0 ? "flex-start" : "center"}
          justifyContent="center"
        >
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            {tasks.length === 0 ? (
              <>
                <Typography sx={{ mr: 1, ml: 2, my: "auto", color: "#777" }}>
                  Não há tarefas
                </Typography>
              </>
            ) : (
              <>
                {tasks.map((task, index) => (
                  <Grid
                    container
                    key={index}
                    direction="row"
                    alignItems="center"
                    justifyContent="flex-start"
                    sx={{ width: 495 }}
                  >
                    <TextField
                      placeholder={"Tarefa #" + (index + 1)}
                      sx={{ width: 215, mx: 1, mt: 1 }}
                      value={task.title}
                      onChange={(e) =>
                        handleInputChange(index, "title", e.target.value)
                      }
                    />
                    <Grid item>
                      <ProjectStageTaskMembers
                        handleClick={handleClick}
                        members={members}
                        index={index}
                        title={task.title}
                        openedPopoverIndex={openedPopoverIndex}
                        anchorElArray={anchorElArray}
                        handleClose={handleClose}
                      />
                    </Grid>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["DatePicker"]} sx={{ ml: 1 }}>
                        <DatePicker
                          sx={{ width: 50 }}
                          label="Prazo da Tarefa"
                          value={task.dueTo || null}
                          onChange={(date) =>
                            handleInputChange(index, "dueTo", date)
                          }
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </Grid>
                ))}
              </>
            )}
            <Grid
              container
              direction="row"
              alignItems="center"
              justifyContent="center"
              sx={{ mb: 2 }}
            >
              <IconButton
                onClick={handleAddTask}
                sx={{ "&:hover": { backgroundColor: "white" } }}
              >
                <AddIcon sx={{ color: "green" }} />
              </IconButton>
              <IconButton
                onClick={onClearTasks}
                sx={{ "&:hover": { backgroundColor: "white" } }}
              >
                <ClearIcon sx={{ color: "red" }} />
              </IconButton>
            </Grid>
          </Collapse>
        </Grid>
      </Grid>
    </>
  );
};

export default ProjectStageTasks;
