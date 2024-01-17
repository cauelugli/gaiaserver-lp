/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";

import { IMaskInput } from "react-imask";
import DeleteIcon from "@mui/icons-material/Delete";
import ProjectStageTasks from "./ProjectStageTasks";

const ProjectStages = () => {
  const [boxes, setBoxes] = useState([
    {
      title: "",
      objective: "",
      tasks: [],
      dueTo: "",
      anchorEl: null,
    },
  ]);

  const getColor = (index) => {
    const colors = [
      "#FF4500",
      "#FFA500",
      "#FFD700",
      "#32CD32",
      "#008000",
      "#00FFFF",
      "#0000FF",
      "#4B0082",
      "#800080",
      "#9932CC",
    ];

    return colors[index % colors.length];
  };

  const handleAddBox = (event, index) => {
    if (boxes.length < 10) {
      setBoxes([
        ...boxes,
        {
          title: "",
          objective: "",
          tasks: [],
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

  const handleTaskClick = (event, index) => {
    const updatedBoxes = [...boxes];
    updatedBoxes[index].anchorEl = event.currentTarget;
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

  const handleClearTasks = () => {
    setBoxes([
      {
        title: "",
        objective: "",
        tasks: [],
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
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Grid item>
                {index === boxes.length - 1 && (
                  <IconButton
                    sx={{ mt: 2 }}
                    onClick={() => handleRemoveBox(index)}
                    disabled={index === 0}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
                <TextField
                  label={`Fase ${index + 1}`}
                  size="small"
                  value={box.title}
                  sx={{ width: 150, backgroundColor: getColor(index), mt: 2 }}
                  onChange={(e) =>
                    handleInputChange(index, "title", e.target.value)
                  }
                />
                <TextField
                  label={`Objetivo`}
                  size="small"
                  value={box.objective}
                  sx={{ width: 250, mx: 1, mt: 2 }}
                  onChange={(e) =>
                    handleInputChange(index, "objective", e.target.value)
                  }
                />
                <FormControl sx={{ mr: 1, mt:2 }}>
                  <ProjectStageTasks
                    tasks={box.tasks}
                    anchorEl={box.anchorEl}
                    onClose={() => handleTaskClose(index)}
                    onAddTask={(newTask) => handleAddTask(index, newTask)}
                    onClearTasks={handleClearTasks}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>
                    <Typography sx={{ fontSize: 13, color: "#777" }}>
                      Prazo Final da Fase
                    </Typography>
                  </FormLabel>
                  <IMaskInput
                    style={{
                      padding: "5%",
                      borderColor: "#eee",
                      width: 150,
                    }}
                    mask="00/00/0000"
                    definitions={{
                      "#": /[1-9]/,
                    }}
                    onChange={(e) =>
                      handleInputChange(index, "dueTo", e.target.value)
                    }
                    overwrite
                    value={box.dueTo}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        ))}
      </Grid>
      {boxes.length < 10 && (
        <Button
          variant="contained"
          color="inherit"
          onClick={handleAddBox}
          sx={{ mt: 2 }}
        >
          +
        </Button>
      )}
    </Grid>
  );
};

export default ProjectStages;
