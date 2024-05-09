/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function EditGroupRenameForm({
  selectedGroup,
  setRename,
  refreshData,
  setRefreshData,
  toast,
  userId,
}) {
  const [name, setName] = React.useState(selectedGroup.name);

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/groups/rename", {
        groupId: selectedGroup._id,
        name,
      });
      if (res.data) {
        toast.success("Grupo Editado!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
        socket.emit("newDataRefreshButton", {
          page: "departments",
          userId: userId,
        });
      }
      setRename(false);
      setRefreshData(!refreshData);
    } catch (err) {
      console.log("err", err);
      if (err.response && err.response.status === 422) {
        toast.error(err.response.data.error, {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      } else {
        toast.error("Houve algum erro...", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
    }
  };

  return (
    <form onSubmit={handleEdit}>
      <DialogTitle>Renomeando Grupo - {selectedGroup.name}</DialogTitle>
      <DialogContent>
        <Grid
          container
          sx={{ mt: 2 }}
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item sx={{ mb: 2 }}>
            <Typography>Novo Nome do Grupo</Typography>
            <TextField
              size="small"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              sx={{ width: 300 }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button type="submit" variant="contained" color="success">
          OK
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => setRename(false)}
        >
          X
        </Button>
      </DialogActions>
    </form>
  );
}
