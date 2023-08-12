/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";

import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

import { IMaskInput } from "react-imask";
import ColorPicker from "../components/small/ColorPicker";
import Members from "../components/small/Members";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const EditDepartmentForm = ({
  openAdd,
  selectedCustomer,
  selectedDepartment,
  users,
  setOpenAdd,
  fetchData,
}) => {
  const [name, setName] = React.useState(selectedDepartment.name);
  const [phone, setPhone] = React.useState(selectedDepartment.phone);
  const [email, setEmail] = React.useState(selectedDepartment.email);

  const [managerName, setManagerName] = React.useState(
    selectedDepartment.manager ? selectedDepartment.manager.name : "N/A"
  );
  const [managerEmail, setManagerEmail] = React.useState(
    selectedDepartment.manager ? selectedDepartment.manager.email : "N/A"
  );
  const [managerPhone, setManagerPhone] = React.useState(
    selectedDepartment.manager ? selectedDepartment.manager.phone : "N/A"
  );
  const [selectedUsers, setSelectedUsers] = React.useState(
    selectedDepartment.members
  );
  const [color, setColor] = React.useState(selectedDepartment.color);
  const [colorAnchorEl, setColorAnchorEl] = React.useState(null);

  function getAvatarColor() {
    const colors = [
      "#FF0000",
      "#FF4500",
      "#FFA500",
      "#FFFF00",
      "#ADFF2F",
      "#00FF00",
      "#00FF7F",
      "#00CED1",
      "#00BFFF",
      "#0000FF",
      "#8A2BE2",
      "#FF00FF",
      "#FF1493",
      "#FF69B4",
      "#FFC0CB",
      "#FFD700",
      "#FF8C00",
      "#FF6347",
      "#CD5C5C",
      "#F08080",
      "#FA8072",
      "#E9967A",
      "#DC143C",
      "#B22222",
      "#8B0000",
      "#808000",
      "#556B2F",
      "#6B8E23",
      "#808000",
      "#2E8B57",
      "#3CB371",
      "#20B2AA",
      "#5F9EA0",
      "#4682B4",
      "#87CEEB",
      "#1E90FF",
      "#6495ED",
      "#0000CD",
      "#8A2BE2",
      "#9400D3",
      "#9932CC",
      "#8A2BE2",
      "#BA55D3",
      "#FF00FF",
      "#FF1493",
      "#FF69B4",
      "#FFC0CB",
      "#FFD700",
      "#FF8C00",
      "#FF6347",
      "#DC143C",
      "#B22222",
      "#8B0000",
      "#CD5C5C",
      "#F08080",
      "#FA8072",
      "#E9967A",
      "#FF4500",
      "#FF6347",
      "#FFA500",
      "#FFD700",
      "#FFFF00",
      "#ADFF2F",
      "#7CFC00",
      "#32CD32",
      "#00FF7F",
      "#00FF00",
      "#00FA9A",
      "#00CED1",
      "#00BFFF",
      "#1E90FF",
      "#4682B4",
      "#8A2BE2",
      "#FF00FF",
      "#FF1493",
      "#FF69B4",
      "#FFC0CB",
    ];

    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }

  const avatarColor = getAvatarColor();

  const handleClickColor = (event) => {
    setColorAnchorEl(event.currentTarget);
  };

  const handleCloseColor = () => {
    setColorAnchorEl(null);
  };

  const handleChangeColor = (selectedColor) => {
    setColor(selectedColor.hex);
    handleCloseColor();
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const membersData = selectedUsers.map((user) => ({
        id: user._id,
        name: user.name,
        avatarColor: user.avatarColor,
      }));

      const editManager = {
        customerId: selectedCustomer._id,
        name: managerName,
        email: managerEmail,
        phone: managerPhone,
        avatarColor: avatarColor,
      };

      const res = await api.put("/departments", {
        departmentId: selectedDepartment._id,
        name,
        phone,
        email,
        color,
        manager: editManager.data,
        members: membersData,
      });
      res.data && alert("Departamento Adicionado!");
      setOpenAdd(!openAdd);
      fetchData();
    } catch (err) {
      alert("Vish, deu não...");
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleEdit}>
      <DialogTitle>
        Editando Departamento - {selectedDepartment.name}
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ mt: 2 }}>Geral</Typography>
        <Grid container direction="row">
          <Grid item>
            <TextField
              size="small"
              label="Nome do Departamento"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              sx={{ mr: 1, mt: 3, width: 300 }}
            />
          </Grid>
          <Grid item>
            <TextField
              value={email}
              size="small"
              label="E-mail Departamento"
              required
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mr: 1, mt: 3, width: 285 }}
            />
          </Grid>
          <Grid item>
            <Typography>Telefone</Typography>
            <IMaskInput
              style={{
                padding: "5%",
                marginRight: "4%",
                marginBottom: "1%",
                borderColor: "#eee",
                borderRadius: 4,
              }}
              mask="(00) 0000-0000"
              definitions={{
                "#": /[1-9]/,
              }}
              onAccept={(value) => setPhone(value)}
              overwrite
              value={phone}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />
        <Grid item>
          <Typography sx={{ my: 2 }}>Membros</Typography>
          <Members
            users={users}
            value={selectedUsers}
            onChange={setSelectedUsers}
          />
        </Grid>

        <Divider sx={{ my: 2 }} />
        <Typography>Gerência</Typography>
        <Grid container direction="row">
          <Grid item>
            <TextField
              label="Nome do Gerente"
              value={managerName}
              size="small"
              onChange={(e) => setManagerName(e.target.value)}
              required
              variant="outlined"
              sx={{ mr: 1, mt: 3, width: 300 }}
            />
          </Grid>
          <Grid item>
            <TextField
              label="E-mail Gerente"
              value={managerEmail}
              size="small"
              onChange={(e) => setManagerEmail(e.target.value)}
              required
              variant="outlined"
              sx={{ mr: 1, mt: 3, width: 285 }}
            />
          </Grid>
          <Grid item>
            <Typography>Telefone</Typography>
            <IMaskInput
              style={{
                padding: "5%",
                marginRight: "4%",
                marginBottom: "1%",
                borderColor: "#eee",
                borderRadius: 4,
              }}
              mask="(00) 00000-0000"
              definitions={{
                "#": /[1-9]/,
              }}
              onAccept={(value) => setManagerPhone(value)}
              overwrite
              value={managerPhone}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />
        <Typography>Etc</Typography>
        <Grid item sx={{ m: "1%" }}>
          <ColorPicker
            handleClickColor={handleClickColor}
            color={color}
            colorAnchorEl={colorAnchorEl}
            handleCloseColor={handleCloseColor}
            handleChangeColor={handleChangeColor}
          />
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
};

export default EditDepartmentForm;
