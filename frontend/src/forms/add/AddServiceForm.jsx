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
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function AddServiceForm({
  openAdd,
  departments,
  setOpenAdd,
  fetchData,
}) {
  const [name, setName] = React.useState("");
  const [department, setDepartment] = React.useState({});
  const [value, setValue] = React.useState(0);
  const [materials, setMaterials] = React.useState({});

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/services", {
        name,
        department: {
          id: department._id,
          name: department.name,
          phone: department.phone,
          email: department.email,
          color: department.color,
        },
        value,
        materials,
      });
      res.data && alert("Serviço Adicionado!");
      setOpenAdd(!openAdd);
      fetchData();
    } catch (err) {
      alert("Vish, deu não...");
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleAdd}>
      <DialogTitle>Novo Serviço</DialogTitle>
      <DialogContent>
        <Grid
          container
          sx={{ pr: "4%", mt: 2 }}
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Grid item>
            <Typography>Nome</Typography>
            <TextField
              size="small"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              sx={{ width: 300 }}
            />
          </Grid>
          <Grid item sx={{mx:2}}>
            <Typography>Departamento</Typography>
            <Select
              onChange={(e) => setDepartment(e.target.value)}
              value={department}
              renderValue={(selected) => selected.name}
              size="small"
              sx={{ minWidth: 200 }}
            >
              {departments.map((item) => (
                <MenuItem
                  value={item}
                  key={item.id}
                  sx={{
                    backgroundColor: item.color,
                    color: "white",
                    "&:hover": {
                      backgroundColor: item.color,
                      color: "white",
                    },
                  }}
                >
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item>
            <Typography>Valor</Typography>
            <TextField
              type="number"
              size="small"
              value={value}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">R$</InputAdornment>
                ),
              }}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (inputValue >= 0) {
                  setValue(inputValue);
                }
              }}
              required
              variant="outlined"
              sx={{ width: 130 }}
            />
          </Grid>
        </Grid>
        <Grid
          container
          sx={{ mt: 2 }}
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Grid item>
            <Typography sx={{ mb: 1 }}>Materiais</Typography>
            <Select
              onChange={(e) => setMaterials(e.target.value)}
              value={materials}
              renderValue={(selected) => selected.name}
              size="small"
              sx={{ minWidth: "200px" }}
            >
              {/* {departments.map((item) => (
                <MenuItem
                  value={item}
                  key={item.id}
                  sx={{
                    backgroundColor: item.color,
                    color: "white",
                    "&:hover": {
                      backgroundColor: item.color,
                      color: "white",
                    },
                  }}
                >
                  {item.name}
                </MenuItem>
              ))} */}
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
          onClick={() => setOpenAdd(!openAdd)}
        >
          X
        </Button>
      </DialogActions>
    </form>
  );
}
