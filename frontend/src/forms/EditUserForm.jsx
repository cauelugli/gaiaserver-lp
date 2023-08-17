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

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const EditUserForm = ({
  openEdit,
  selectedUser,
  departments,
  setOpenEdit,
  fetchData,
}) => {
  const [name, setName] = React.useState(selectedUser.name);
  const [email, setEmail] = React.useState(selectedUser.email);
  const [phone, setPhone] = React.useState(selectedUser.phone);
  const [position, setPosition] = React.useState(selectedUser.position);
  const [department, setDepartment] = React.useState(selectedUser.department);
  const [previousData, setPreviousData] = React.useState(selectedUser);

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/users", {
        userId: selectedUser._id,
        name,
        email,
        phone,
        position,
        department: {
          id: department.id,
          name: department.name,
          color: department.color,
        },
        avatarColor: avatarColor,
        previousData: previousData,
      });
      res.data && alert("Editado com sucesso!");
      setOpenEdit(!openEdit);
      fetchData();
    } catch (err) {
      alert("Vish, editei não...");
      console.log(err);
    }
  };

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

  return (
    <form onSubmit={handleEdit}>
      <DialogTitle>Editando Usuário {selectedUser.name}</DialogTitle>
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
          <Grid item sx={{ mt: 3 }}>
            <Typography>Acesso</Typography>
            <TextField
              size="small"
              value={position}
              disabled
              sx={{ width: 120 }}
            />
          </Grid>
          <Grid item sx={{ mt: 3, ml: "10%" }}>
            <Typography>Departamento</Typography>
            <FormControl>
              <Select
                onChange={(e) => setDepartment(e.target.value)}
                value={department}
                disabled={position !== "Comum"}
                renderValue={(selected) => selected.name}
                sx={{ mt: 1 }}
                size="small"
              >
                {departments.map((item) => (
                  <MenuItem
                    value={item}
                    key={item.id}
                    sx={{
                      backgroundColor: item.color,
                      color: "none",
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
              {position === "Gerente" && (
                <FormHelperText>
                  Para alterar o Gerente, visite{" "}
                  <Link
                    to="/departments"
                    style={{
                      textDecoration: "none",
                      color: "black",
                    }}
                  >
                    Departamentos
                  </Link>
                </FormHelperText>
              )}
            </FormControl>
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
