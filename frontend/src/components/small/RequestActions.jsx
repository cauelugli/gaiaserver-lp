/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";

import { Button, FormHelperText, Grid, Tooltip } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

const RequestActions = ({
  selectedJob,
  config,
  user,
  job,
  handleManagerApproval,
  handleRequestApproval,
  handleOpenEdit,
  handleConfirmDelete,
}) => {
  return (
    <Grid
      container
      direction="row"
      alignItems="center"
      justifyContent="flex-end"
      sx={{
        my: 7,
      }}
    >
      {user.role === "Gerente" && job.status !== "Aprovado" && (
        <Button
          cursor="pointer"
          variant="contained"
          color="primary"
          onClick={() => handleManagerApproval(selectedJob)}
          startIcon={<CheckIcon />}
        >
          Aprovar
        </Button>
      )}

      {job.status === "Aberto" && user.role !== "Gerente" && (
        <Button
          cursor="pointer"
          variant="contained"
          color="primary"
          onClick={() => handleRequestApproval(selectedJob)}
          startIcon={<CheckIcon />}
        >
          Solicitar Aprovação
        </Button>
      )}

      {job.status !== "Aberto" &&
        job.status !== "Concluido" &&
        user.role !== "Gerente" && (
          <Button
            cursor="pointer"
            variant="contained"
            color="success"
            disabled={job.status === "Aprovação Solicitada"}
            onClick={() => handleOpenEdit(job, "resolve")}
            startIcon={<CheckIcon />}
          >
            Resolver
          </Button>
        )}

      <Button
        cursor="pointer"
        variant="contained"
        color="warning"
        onClick={() => handleOpenEdit(job, "interaction")}
        startIcon={<AddIcon />}
        sx={{ ml: 1 }}
      >
        Interação
      </Button>
      <Button
        cursor="pointer"
        variant="outlined"
        color="inherit"
        disabled={job.createdBy !== user.username}
        onClick={() => handleOpenEdit(job, "edit")}
        sx={{ mx: 1 }}
        startIcon={<ModeEditIcon />}
        >
        Editar
      </Button>
      <Button
        cursor="pointer"
        variant="contained"
        onClick={() => handleConfirmDelete(job)}
        color="error"
        disabled={!config.canBeDeleted}
        startIcon={<DeleteIcon />}
      >
        Deletar
      </Button>
    </Grid>
  );
};

export default RequestActions;
