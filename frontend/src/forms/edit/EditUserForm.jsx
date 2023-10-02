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

const EditUserForm = ({
  openEdit,
  selectedUser,
  departments,
  setOpenEdit,
  fetchData,
  toast,
}) => {
  const [name, setName] = React.useState(selectedUser.name);
  const [email, setEmail] = React.useState(selectedUser.email);
  const [phone, setPhone] = React.useState(selectedUser.phone);
  const [department, setDepartment] = React.useState(
    selectedUser.department || ""
  );
  const [position, setPosition] = React.useState(selectedUser.position);
  const previousData = selectedUser;
  const [colorAnchorEl, setColorAnchorEl] = React.useState(null);
  const [avatarColor, setAvatarColor] = React.useState(
    selectedUser.avatarColor
  );

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
      const res = await api.put("/users", {
        userId: selectedUser._id,
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
        position,
        avatarColor,
        previousData,
      });
      if (res.data) {
        toast.success("Colaborador Editado!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
      setOpenEdit(!openEdit);
      fetchData();
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
      <DialogTitle>Editando Colaborador - {selectedUser.name}</DialogTitle>
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
          sx={{ mt: 2 }}
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
            <Typography sx={{ mb: 1, ml: 2 }}>Ocupação</Typography>
            <TextField
              size="small"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              sx={{ ml: 2, width: 250 }}
            />
          </Grid>
          <Grid item sx={{ ml: "10%" }}>
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

export default EditUserForm;
