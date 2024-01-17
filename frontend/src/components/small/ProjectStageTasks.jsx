/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import {
  Button,
  TextField,
  ListItemText,
  Avatar,
  IconButton,
  FormControl,
  FormLabel,
  Typography,
  Grid,
  Collapse,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import { IMaskInput } from "react-imask";

const ProjectStageTasks = ({ tasks, onAddTask, onClearTasks }) => {
  const [newTask, setNewTask] = useState({
    title: "",
    assignee: "",
    dueTo: "",
    status: "Não Executado",
  });
  const [expanded, setExpanded] = React.useState(false);

  const handleInputChange = (index, field, value) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = { ...updatedTasks[index], [field]: value };
  };

  const handleAddTask = () => {
    onAddTask([...tasks, newTask]);
    setNewTask({
      title: "",
      assignee: "",
      dueTo: "",
      status: "Não Executado",
    });
  };

  return (
    <>
      <Grid
        container
        direction="column"
        alignItems="flex-start"
        justifyContent="flex-start"
        sx={{ border: "1px solid #bbb", borderRadius: 1, width: 500 }}
      >
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          onClick={() => setExpanded(!expanded)}
        >
          <Typography sx={{ mr: 1, ml: 2, my: "auto", color: "#777" }}>
            Tarefas
          </Typography>
          <IconButton>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Grid>

        <Grid
          container
          direction="column"
          alignItems="center"
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
                    direction="row"
                    key={index}
                    alignItems="center"
                    justifyContent="flex-start"
                    sx={{ mb: 2 }}
                  >
                    <Typography sx={{ mr: 1, ml: -1 }}>{index + 1}</Typography>
                    <ListItemText>
                      <TextField
                        size="small"
                        placeholder="Título"
                        sx={{ width: 150 }}
                        value={task.title}
                        onChange={(e) =>
                          handleInputChange(index, "title", e.target.value)
                        }
                      />
                    </ListItemText>
                    <ListItemText sx={{ mx: -2 }}>
                      <FormControl>
                        <FormLabel>
                          <Typography sx={{ fontSize: 13, color: "#777" }}>
                            Designados
                          </Typography>
                        </FormLabel>
                        <IconButton>
                          <Avatar sx={{ width: 26, height: 26 }} />
                        </IconButton>
                      </FormControl>
                    </ListItemText>
                    <ListItemText>
                      <FormControl>
                        <FormLabel>
                          <Typography
                            sx={{ fontSize: 13, color: "#777", mb: 0.5 }}
                          >
                            Prazo Final da Tarefa
                          </Typography>
                        </FormLabel>
                        <IMaskInput
                          style={{
                            padding: "5%",
                            borderColor: "#eee",
                            width: 120,
                          }}
                          mask="00/00/0000"
                          definitions={{
                            "#": /[1-9]/,
                          }}
                          onChange={(e) =>
                            handleInputChange(index, "dueTo", e.target.value)
                          }
                          overwrite
                          value={task.dueTo}
                        />
                      </FormControl>
                    </ListItemText>
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
