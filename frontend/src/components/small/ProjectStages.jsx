/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import dayjs from "dayjs";

import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";

import DeleteIcon from "@mui/icons-material/Delete";
import ProjectStageTasks from "./ProjectStageTasks";

const ProjectStages = ({ members }) => {
  const [index, setIndex] = useState(0);
  const [title, setTitle] = useState("");
  const [tasks, setTasks] = useState([]);
  const [startAt, setStartAt] = useState(null);
  const [dueTo, setDueTo] = useState(null);
  const [boxes, setBoxes] = useState([]);

  const getColor = (index) => {
    const colors = ["#FF4500", "#FFA500", "#FFD700", "#32CD32", "#008000"];
    return colors[index % colors.length];
  };

  const addStage = () => {
    const newBox = {
      id: index,
      title,
      tasks,
      startAt: dayjs(startAt).format("DD/MM/YYYY"),
      dueTo: dayjs(dueTo).format("DD/MM/YYYY"),
      color: getColor(index),
    };

    setBoxes([...boxes, newBox]);
    setTitle("");
    setTasks([]);
    setStartAt(null);
    setDueTo(null);
    setIndex(index + 1);
  };

  const removeLastStage = (boxIndex) => {
    if (boxes.length > 0) {
      setIndex(index - 1);
      const updatedBoxes = [...boxes];
      updatedBoxes.pop();
      setBoxes(updatedBoxes);
    }
  };

  const handleAddTask = (boxIndex, newTasks) => {
    const updatedTasks = [...tasks];
    updatedTasks[boxIndex] = { ...updatedTasks[boxIndex], tasks: newTasks };
    setTasks(updatedTasks);
  };

  const handleUpdateTask = (boxIndex, updatedTasks) => {
    const updatedTasksArray = [...tasks];
    updatedTasksArray[boxIndex] = {
      ...updatedTasksArray[boxIndex],
      tasks: updatedTasks,
    };
    setTasks(updatedTasksArray);
  };

  const handleClearTasks = (boxIndex) => {
    const updatedTasksArray = [...tasks];
    updatedTasksArray[boxIndex] = { ...updatedTasksArray[boxIndex], tasks: [] };
    setTasks(updatedTasksArray);
  };

  const renderBox = (box, editable) => (
    <Box
      key={box.id}
      sx={{
        mt: 2,
        display: "flex",
        alignItems: "center",
      }}
    >
      <Grid container direction="row" alignItems="center">
        <Typography sx={{ my: "auto", mr: 1 }}>{box.id + 1}</Typography>
        <TextField
          sx={{ backgroundColor: box.color, mr: 1, width: 200 }}
          value={box.title}
          disabled={!editable}
        />
        <TextField
          placeholder="Tasks"
          value={box.tasks}
          disabled={!editable}
          sx={{ mr: 1 }}
        />
        <TextField
          placeholder="Início da Fase"
          value={box.startAt || ""}
          disabled={!editable}
          sx={{ mr: 1 }}
        />
        <TextField
          placeholder="Due To"
          value={box.dueTo || ""}
          disabled={!editable}
        />
        {editable ? (
          <IconButton onClick={() => removeLastStage(box.id)}>
            <DeleteIcon />
          </IconButton>
        ) : (
          <IconButton disabled>
            <DeleteIcon sx={{ opacity: 0 }} />
          </IconButton>
        )}
      </Grid>
    </Box>
  );

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <Grid
        container
        direction="row"
        alignItems="center"
        justifyContent="center"
      >
        <TextField
          placeholder="Nome da Etapa"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mt: 1, mr: 1, width: 200 }}
        />
        <ProjectStageTasks
          tasks={tasks}
          members={members}
          onAddTask={(newTasks) => handleAddTask(index, newTasks)}
          onUpdateTask={(updatedTasks) => handleUpdateTask(index, updatedTasks)}
          onClearTasks={() => handleClearTasks(index)}
        />

        <FormControl sx={{ mr: 1 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                label="Início da Fase"
                value={startAt || null}
                onChange={(date) => setStartAt(date)}
              />
            </DemoContainer>
          </LocalizationProvider>
        </FormControl>
        <FormControl>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                label="Due To"
                value={dueTo || null}
                onChange={(date) => setDueTo(date)}
              />
            </DemoContainer>
          </LocalizationProvider>
        </FormControl>
      </Grid>
      <Button
        variant="contained"
        color="inherit"
        sx={{ mt: 3 }}
        onClick={addStage}
      >
        + ADICIONAR FASE
      </Button>

      {boxes.length > 0 && (
        <>
          <Typography variant="h5" sx={{ mt: 3 }}>
            Fases do Projeto
          </Typography>
          {boxes.map((box, index) =>
            renderBox(box, index === boxes.length - 1)
          )}
        </>
      )}
    </Grid>
  );
};

export default ProjectStages;
