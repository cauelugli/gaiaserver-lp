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

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import DeleteIcon from "@mui/icons-material/Delete";
import ProjectStageTasks from "./ProjectStageTasks";

const ProjectStages = ({ members }) => {
  const [boxes, setBoxes] = useState([
    {
      title: "",
      tasks: [],
      startAt: "",
      dueTo: "",
      anchorEl: null,
    },
  ]);

  const getColor = (index) => {
    const colors = ["#FF4500", "#FFA500", "#FFD700", "#32CD32", "#008000"];

    return colors[index % colors.length];
  };

  const handleAddBox = (event, index) => {
    if (boxes.length < 5) {
      setBoxes([
        ...boxes,
        {
          title: "",
          tasks: [],
          startAt: "",
          dueTo: "",
          anchorEl: null,
        },
      ]);
    }
  };

  const handleRemoveBox = (index) => {
    if (index === boxes.length - 1) {
      setBoxes(boxes.slice(0, -1));
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedBoxes = [...boxes];
    updatedBoxes[index][field] = value;
    setBoxes(updatedBoxes);
  };

  const handleTaskClose = (index) => {
    const updatedBoxes = [...boxes];
    updatedBoxes[index].anchorEl = null;
    setBoxes(updatedBoxes);
  };

  const handleAddTask = (boxIndex, newTask) => {
    const updatedBoxes = [...boxes];
    updatedBoxes[boxIndex].tasks.push(newTask);
    setBoxes(updatedBoxes);
  };

  const handleUpdateTask = (boxIndex, updatedTasks) => {
    const updatedBoxes = [...boxes];
    updatedBoxes[boxIndex].tasks = updatedTasks;
    setBoxes(updatedBoxes);
  };

  const handleClearTasks = () => {
    setBoxes([
      {
        title: "",
        tasks: [],
        startAt: "",
        dueTo: "",
        anchorEl: null,
      },
    ]);
  };

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        {boxes.map((box, index) => (
          <Box key={index} sx={{ width: "100%" }}>
            <Grid
              container
              direction="row"
              alignItems="center"
              justifyContent="flex-start"
            >
              {index === boxes.length - 1 ? (
                <IconButton
                  onClick={() => handleRemoveBox(index)}
                  disabled={index === 0}
                >
                  <DeleteIcon />
                </IconButton>
              ) : (
                <IconButton disabled sx={{ opacity: 0 }}>
                  <DeleteIcon />
                </IconButton>
              )}
              <Grid>
                <TextField
                  placeholder={`Fase ${index + 1}`}
                  value={box.title}
                  sx={{
                    width: 130,
                    backgroundColor: getColor(index),
                    mt: 1,
                  }}
                  onChange={(e) =>
                    handleInputChange(index, "title", e.target.value)
                  }
                />
                <FormControl sx={{ mx: 1, mt: 1 }}>
                  <ProjectStageTasks
                    tasks={box.tasks}
                    members={members}
                    anchorEl={box.anchorEl}
                    indexB={index}
                    onClose={() => handleTaskClose(index)}
                    onAddTask={(newTask) => handleAddTask(index, newTask)}
                    onUpdateTask={(updatedTasks) =>
                      handleUpdateTask(index, updatedTasks)
                    }
                    onClearTasks={handleClearTasks}
                  />
                </FormControl>

                <FormControl sx={{ mr: 1 }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker"]}>
                      <DatePicker
                        sx={{ width: 2 }}
                        label="Início da Fase"
                        value={box.startAt || null}
                        onChange={(date) =>
                          handleInputChange(index, "startAt", date)
                        }
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </FormControl>
                <FormControl>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker"]}>
                      <DatePicker
                        sx={{ width: 50 }}
                        label="Término da Fase"
                        value={box.dueTo || null}
                        onChange={(date) =>
                          handleInputChange(index, "dueTo", date)
                        }
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        ))}
      </Grid>
      {boxes.length < 5 && (
        <Button
          variant="contained"
          color="inherit"
          onClick={handleAddBox}
          sx={{ mt: 3 }}
        >
          + ADICIONAR FASE
        </Button>
      )}
    </Grid>
  );
};

export default ProjectStages;
