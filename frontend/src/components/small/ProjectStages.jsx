/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const ProjectStages = () => {
  const [boxes, setBoxes] = useState([
    { title: "", objective: "", tasks: "", status: "" },
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

  const handleAddBox = () => {
    if (boxes.length < 10) {
      setBoxes([...boxes, { title: "", objective: "", tasks: "", status: "" }]);
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
          <Box key={index}>
            <Grid
              container
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Grid item>
                {index === boxes.length - 1 && (
                  <IconButton
                    sx={{ mt: 1 }}
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
                  sx={{ width: 200, backgroundColor: getColor(index), m: 1 }}
                  onChange={(e) =>
                    handleInputChange(index, "title", e.target.value)
                  }
                />
                <TextField
                  label={`Objetivo`}
                  size="small"
                  value={box.objective}
                  sx={{ width: 200, m: 1 }}
                  onChange={(e) =>
                    handleInputChange(index, "objective", e.target.value)
                  }
                />
                <TextField
                  label={`Tarefas`}
                  size="small"
                  value={box.tasks}
                  sx={{ width: 200, m: 1 }}
                  onChange={(e) =>
                    handleInputChange(index, "tasks", e.target.value)
                  }
                />
                <TextField
                  label={`Status`}
                  size="small"
                  value={box.status}
                  sx={{ width: 200, m: 1 }}
                  onChange={(e) =>
                    handleInputChange(index, "status", e.target.value)
                  }
                />
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
