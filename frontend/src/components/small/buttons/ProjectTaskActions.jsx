/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import * as React from "react";

import { Button, Grid } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";

export default function ProjectTaskActions({
  // configData,
  task,
  handleAddInteraction,
  handleResolveTask,
  isAddingInteraction,
  setIsAddingInteraction,
}) {
  return (
    <>
      {isAddingInteraction ? (
        <Grid container direction="row" justifyContent="flex-end">
          <Button
            cursor="pointer"
            variant="contained"
            color="success"
            size="small"
            onClick={handleAddInteraction}
            sx={{ mx: 1 }}
            startIcon={<CheckIcon />}
          >
            Salvar Interação
          </Button>
          <Button
            cursor="pointer"
            variant="contained"
            color="error"
            size="small"
            onClick={() => setIsAddingInteraction(!isAddingInteraction)}
            sx={{ mx: 1 }}
            startIcon={<DeleteIcon />}
          >
            Apagar Interação
          </Button>
        </Grid>
      ) : (
        <Grid container direction="row" justifyContent="flex-end">
          <Button
            cursor="pointer"
            variant="outlined"
            color="inherit"
            size="small"
            onClick={() => setIsAddingInteraction(!isAddingInteraction)}
            sx={{ mx: 1 }}
            startIcon={<AddIcon />}
          >
            Adicionar Interação
          </Button>
          <Button
            cursor="pointer"
            color="success"
            variant="contained"
            size="small"
            onClick={() => handleResolveTask(task)}
            disabled={task.status === "Resolvido" || isAddingInteraction}
            startIcon={<CheckIcon />}
          >
            Resolver Tarefa
          </Button>
        </Grid>
      )}
    </>
  );
}
