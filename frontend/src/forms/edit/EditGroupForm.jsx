/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";

import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

import Members from "../../components/small/Members";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function EditGroupForm({
  selectedGroup,
  users,
  openEdit,
  setOpenEdit,
  refreshData,
  setRefreshData,
  toast,
}) {
  const [name, setName] = React.useState(selectedGroup.name);
  const [members, setMembers] = React.useState(selectedGroup.members);
  const previousData = selectedGroup;

  const handleEdit = async (e) => {
    e.preventDefault();
    const membersToSend = members.map(({ _id, name }) => ({ _id, name }));

    try {
      const res = await api.put("/groups", {
        groupId: selectedGroup._id,
        previousData,
        name,
        members: membersToSend,
      });
      if (res.data) {
        toast.success("Grupo Editado!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
      setOpenEdit(!openEdit);
      setRefreshData(!refreshData);
    } catch (err) {
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
      <DialogTitle>Editando Grupo - {selectedGroup.name}</DialogTitle>
      <DialogContent>
        <Grid
          container
          sx={{ mt: 2 }}
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item sx={{ mb: 2 }}>
            <Typography>Nome do Grupo</Typography>
            <TextField
              size="small"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              sx={{ width: 300 }}
            />
          </Grid>
          <Grid item sx={{ mb: 2 }}>
            <Typography>Membros</Typography>
            <Members
              users={users}
              value={members}
              onChange={(newValue) => setMembers(newValue)}
              option="group"
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
          onClick={() => setOpenEdit(!openEdit)}
        >
          X
        </Button>
      </DialogActions>
    </form>
  );
}
