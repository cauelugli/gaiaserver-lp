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
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function EditPositionForm({
  selectedPosition,
  departments,
  openEdit,
  setOpenEdit,
  refreshData,
  setRefreshData,
  toast,
}) {
  const [name, setName] = React.useState(selectedPosition.name);
  const [department, setDepartment] = React.useState(
    selectedPosition.department
  );
  const previousData = selectedPosition;

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/positions", {
        positionId: selectedPosition._id,
        previousData,
        name,
        department: {
          _id: department._id,
          name: department.name,
          type: department.type,
          color: department.color,
        },
      });
      if (res.data) {
        toast.success("Cargo Editado!", {
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
      <DialogTitle>Editando Cargo - {selectedPosition.name}</DialogTitle>
      <DialogContent>
        <Grid
          container
          sx={{ mt: 2 }}
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item sx={{ mb: 2 }}>
            <Typography>Nome do Cargo</Typography>
            <TextField
              size="small"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              sx={{ width: 300 }}
            />
          </Grid>
          <Grid item sx={{ mb: 2 }}>
            <Typography>Departamento</Typography>
            <Select
              required
              sx={{ width: 300 }}
              onChange={(e) => setDepartment(e.target.value)}
              value={department}
              renderValue={(selected) => (
                <Grid container direction="row">
                  <Paper
                    elevation={0}
                    sx={{
                      mr: 1,
                      mt: 0.5,
                      width: 15,
                      height: 15,
                      borderRadius: 50,
                      backgroundColor: selected.color,
                    }}
                  />
                  <Typography>{selected.name}</Typography>
                </Grid>
              )}
              size="small"
            >
              {departments
                .map((item) => (
                  <MenuItem value={item} key={item.id}>
                    <Grid container direction="row">
                      <Paper
                        elevation={0}
                        sx={{
                          mr: 1,
                          mt: 0.5,
                          width: 15,
                          height: 15,
                          borderRadius: 50,
                          backgroundColor: item.color,
                        }}
                      />
                      <Typography>{item.name}</Typography>
                    </Grid>
                  </MenuItem>
                ))}
            </Select>
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
