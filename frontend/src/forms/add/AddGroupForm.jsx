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

import DialogHeader from "../../components/small/DialogHeader";
import FormEndLineTenant from "../../components/small/FormEndLineTenant";
import Members from "../../components/small/Members";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function AddGroupForm({
  openAdd,
  userName,
  users,
  setOpenAdd,
  refreshData,
  setRefreshData,
  configCustomization,
  toast,
}) {
  const [name, setName] = React.useState("");
  const [members, setMembers] = React.useState([]);

  const handleAdd = async (e) => {
    e.preventDefault();
    const membersToSend = members.map(({ _id, name, position }) => ({
      _id,
      name,
      position,
    }));

    try {
      const res = await api.post("/groups", {
        name,
        members: membersToSend,
        creator: userName,
      });
      if (res.data) {
        toast.success("Grupo Adicionado!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
      setOpenAdd(!openAdd);
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
        console.log("err", err);
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
    <form onSubmit={handleAdd}>
      <DialogHeader title="Grupo" femaleGender={false} extraSmall />
      <DialogContent>
        <Grid
          container
          sx={{ mt: 2 }}
          direction="column"
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
      <FormEndLineTenant configCustomization={configCustomization} extraSmall />
      <DialogActions>
        <Button type="submit" variant="contained" color="success">
          OK
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => setOpenAdd(!openAdd)}
        >
          X
        </Button>
      </DialogActions>
    </form>
  );
}
