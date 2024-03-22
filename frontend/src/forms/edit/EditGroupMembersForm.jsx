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

export default function EditGroupMembersForm({
  selectedGroup,
  users,
  setOpenEditMembers,
  refreshData,
  setRefreshData,
  toast,
}) {
  const [members, setMembers] = React.useState(selectedGroup.members);

  const handleEdit = async (e) => {
    e.preventDefault();
    const membersToSend = members.map(({ _id, name, position }) => ({
      _id,
      name,
      position,
    }));

    try {
      const res = await api.put("/groups/editMembers", {
        groupId: selectedGroup._id,
        name: selectedGroup.name,
        previousMembers: selectedGroup.members,
        members: membersToSend,
      });
      if (res.data) {
        toast.success("Membros do Grupo Editados!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
      setOpenEditMembers(false);
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
      <DialogTitle>
        Membros do Grupo - {selectedGroup.name}
      </DialogTitle>
      <DialogContent>
        <Grid
          container
          sx={{ mt: 2 }}
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
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
          onClick={() => setOpenEditMembers(false)}
        >
          X
        </Button>
      </DialogActions>
    </form>
  );
}
