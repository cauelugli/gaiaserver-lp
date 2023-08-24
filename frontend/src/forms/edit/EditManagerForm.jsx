/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  ListSubheader,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { IMaskInput } from "react-imask";
import ColorPicker from "../../components/small/ColorPicker";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const EditManagerForm = ({
  openEdit,
  selectedManager,
  departments,
  setOpenEdit,
  fetchData,
}) => {
  const [name, setName] = React.useState(selectedManager.name);
  const [email, setEmail] = React.useState(selectedManager.email);
  const [phone, setPhone] = React.useState(selectedManager.phone);
  const [department, setDepartment] = React.useState(selectedManager.department || "");
  const [avatarColor, setAvatarColor] = React.useState(
    selectedManager.avatarColor
  );
  const previousData = selectedManager;
  const [colorAnchorEl, setColorAnchorEl] = React.useState(null);

  const handleClickColor = (event) => {
    setColorAnchorEl(event.currentTarget);
  };

  const handleCloseColor = () => {
    setColorAnchorEl(null);
  };

  const handleChangeColor = (selectedColor) => {
    setAvatarColor(selectedColor.hex);
    handleCloseColor();
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/managers", {
        managerId: selectedManager._id,
        name,
        email,
        phone,
        department: {
          id: department.id || department._id,
          name: department.name,
          phone: department.phone,
          email: department.email,
          color: department.color,
        },
        avatarColor,
        previousData,
      });
      res.data && alert("Gerente editado com sucesso!");
      setOpenEdit(!openEdit);
      fetchData();
    } catch (err) {
      alert("Vish, editei não...");
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleEdit}>
      <DialogTitle>Editando Gerente - {selectedManager.name}</DialogTitle>
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
              sx={{ mr: 1, width: 300 }}
            />
          </Grid>
          <Grid item>
            <Typography>Email</Typography>
            <TextField
              value={email}
              size="small"
              required
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mr: 1, width: 285 }}
            />
          </Grid>
          <Grid item>
            <Typography>Telefone</Typography>
            <IMaskInput
              style={{
                padding: "5%",
                marginRight: "4%",
                marginTop: "1%",
                borderColor: "#eee",
                borderRadius: 4,
              }}
              mask="(00) 00000-0000"
              definitions={{
                "#": /[1-9]/,
              }}
              onAccept={(value) => setPhone(value)}
              overwrite
              value={phone}
            />
          </Grid>
        </Grid>
        <Grid
          container
          sx={{ pr: "4%", mt: 2 }}
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Grid item>
            <Typography sx={{ mb: 1 }}>Departamento</Typography>
            <Select
              onChange={(e) => setDepartment(e.target.value)}
              value={department}
              renderValue={(selected) => selected.name}
              size="small"
              sx={{ minWidth: "200px" }}
            >
              <ListSubheader sx={{ color: "green", m: -1 }}>
                Disponíveis
              </ListSubheader>
              {departments
                .filter((department) => department.manager === "")
                .map((department) => (
                  <MenuItem
                    value={department}
                    key={department._id}
                    sx={{ fontSize: "100%" }}
                  >
                    {department.name}
                  </MenuItem>
                ))}
              <ListSubheader sx={{ color: "red", m: -1, mt: 0 }}>
                Gerenciados
              </ListSubheader>
              {departments
                .filter((department) => department.manager !== "")
                .map((department) => (
                  <MenuItem
                    disabled
                    value={department}
                    key={department._id}
                    sx={{ fontSize: "100%" }}
                  >
                    {department.name}
                  </MenuItem>
                ))}
            </Select>
          </Grid>
          <Grid item sx={{ml:"10%"}}>
            <Typography>Avatar</Typography>
            <ColorPicker
              handleClickColor={handleClickColor}
              color={avatarColor}
              colorAnchorEl={colorAnchorEl}
              handleCloseColor={handleCloseColor}
              handleChangeColor={handleChangeColor}
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
};

export default EditManagerForm;
