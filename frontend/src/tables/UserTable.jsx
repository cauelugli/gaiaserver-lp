import * as React from "react";
import axios from "axios";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditOffIcon from "@mui/icons-material/EditOff";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import SearchIcon from "@mui/icons-material/Search";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function UserTable({ selectedCustomer }) {
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [option, setOption] = React.useState("");
  const [users, setUsers] = React.useState([]);

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("@");
  const [phone, setPhone] = React.useState("");
  const [position, setPosition] = React.useState("");
  const [department, setDepartment] = React.useState("");
  const [manager, setManager] = React.useState("");

  const [editing, setEditing] = React.useState(false);

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

  const handleOpen = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedUser("");
    setEditing(false);
    setOpen(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/users", {
        customerId: selectedCustomer._id,
        name,
        email,
        phone,
        position,
        department,
        manager,
        avatar: name[0],
        avatarColor: avatarColor,
      });
      res.data && alert("Usuário Adicionado!");
      setUsers((prevUsers) => [...prevUsers, res.data]);
      setName("");
      setEmail("");
      setPhone("");
      setPosition("");
      setDepartment("");
      setManager("");
      handleClose(true);
    } catch (err) {
      alert("Vish, deu não...");
      console.log(err);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/users", {
        customerId: selectedCustomer._id,
        userId: selectedUser._id,
        name,
        email,
        phone,
        position,
        department,
        manager,
        avatar: name[0],
        avatarColor: avatarColor,
      });
      res.data && alert("Usuário Editado!");

      const response = await api.get("/users");
      setUsers(
        response.data.filter((user) => user.customerId === selectedCustomer._id)
      );
      //setUsers((prevUsers) => [...prevUsers, res.data]);
      setName("");
      setEmail("");
      setPhone("");
      setPosition("");
      setDepartment("");
      setManager("");
      handleClose(true);
    } catch (err) {
      alert("Vish, deu não...");
      console.log(err);
    }
  };

  const handleDelete = async (selectedUserId) => {
    try {
      await api.delete(`/users/${selectedUserId}`);
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user._id !== selectedUserId)
      );
    } catch (err) {
      alert("Vish, deletou não..");
      console.log(err);
    }
    handleClose();
  };

  return (
    <>
      <Button onClick={() => handleOpen(setOption("add"))}>
        <Typography variant="h6" color="#eee">
          + Novo
        </Typography>
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell align="right">E-mail</TableCell>
              <TableCell align="right">Telefone</TableCell>
              <TableCell align="right">Departamento</TableCell>
              <TableCell align="right">Editar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users &&
              users.map((user) => (
                <TableRow
                  key={user._id}
                  sx={{ "&:hover": { backgroundColor: "#ccc " } }}
                >
                  <TableCell cursor="pointer" align="left">
                    {user.name}
                  </TableCell>
                  <TableCell cursor="pointer" align="right">
                    {user.email}
                  </TableCell>
                  <TableCell cursor="pointer" align="right">
                    {user.phone}
                  </TableCell>
                  <TableCell cursor="pointer" align="right">
                    {user.department}
                  </TableCell>
                  <TableCell cursor="pointer" align="right">
                    <SearchIcon
                      cursor="pointer"
                      onClick={() => handleOpen(user, setOption("view"))}
                      sx={{ color: "#333" }}
                    />
                    <ModeEditIcon
                      cursor="pointer"
                      onClick={() =>
                        handleOpen(user, setOption("view", setEditing(true)))
                      }
                      sx={{ color: "#555" }}
                    />
                    <DeleteIcon
                      cursor="pointer"
                      option="delete"
                      onClick={() => handleOpen(user, setOption("delete"))}
                      sx={{ color: "#ff4444" }}
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {open && (
        <Dialog open={open} onClose={handleClose}>
          {option === "view" && (
            <>
              <form onSubmit={handleEdit}>
                <DialogContent>
                  <Typography sx={{ my: 1 }}>Geral</Typography>
                  <TextField
                    label={!editing ? "Nome do Usuário" : selectedUser.name}
                    margin="dense"
                    id="name"
                    fullWidth
                    value={!editing ? selectedUser.name : name}
                    disabled={!editing}
                    onChange={(e) => setName(e.target.value)}
                    variant="outlined"
                  />
                  <TextField
                    label={!editing ? "Email" : selectedUser.email}
                    margin="dense"
                    id="email"
                    fullWidth
                    value={!editing ? selectedUser.email : email}
                    disabled={!editing}
                    onChange={(e) => setEmail(e.target.value)}
                    variant="outlined"
                  />
                  <TextField
                    label={!editing ? "Telefone" : selectedUser.phone}
                    margin="dense"
                    id="phone"
                    fullWidth
                    value={!editing ? selectedUser.phone : phone}
                    disabled={!editing}
                    onChange={(e) => setPhone(e.target.value)}
                    variant="outlined"
                  />
                  <Typography sx={{ my: 1 }}>
                    Departamental - checkbox
                  </Typography>
                  <FormControl sx={{ my: 1, width: 265 }}>
                    <InputLabel>Gerente</InputLabel>
                    <Select
                      label={!editing ? "Gerente" : selectedUser.manager}
                      value={!editing ? selectedUser.manager : manager}
                      disabled={!editing}
                      onChange={(e) => setManager(e.target.value)}
                      required
                    >
                      {/* {filteredManagers.map((item) => (
                        <MenuItem value={item.name}>{item.name}</MenuItem>
                      ))} */}
                    </Select>
                  </FormControl>

                  <FormControl sx={{ m: 1, width: 125 }}>
                    <InputLabel>Acesso</InputLabel>
                    <Select
                      label={!editing ? "Acesso" : selectedUser.position}
                      value={!editing ? selectedUser.position : position}
                      disabled={!editing}
                      onChange={(e) => setPosition(e.target.value)}
                      required
                    >
                      <MenuItem value={"Comum"}>Comum</MenuItem>
                      <MenuItem value={"Supervisor"}>Supervisor</MenuItem>
                      <MenuItem value={"Admin"}>Admin</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl sx={{ m: 1, width: 125 }}>
                    <InputLabel>Departamento</InputLabel>
                    <Select
                      label="Departamento"
                      value={!editing ? selectedUser.department : department}
                      disabled={!editing}
                      onChange={(e) => setDepartment(e.target.value)}
                    >
                      {/* {filteredDepartments.map((item) => (
                        <MenuItem value={item.name}>{item.name}</MenuItem>
                      ))} */}
                    </Select>
                  </FormControl>
                </DialogContent>
                <DialogActions>
                  {!editing && (
                    <>
                      <Button
                        onClick={handleClose}
                        variant="contained"
                        color="success"
                      >
                        OK
                      </Button>
                      <Button color="warning" variant="contained">
                        <ModeEditIcon onClick={() => setEditing(!editing)} />
                      </Button>
                    </>
                  )}
                  {editing && (
                    <>
                      <Button
                        onClick={handleEdit}
                        variant="contained"
                        color="warning"
                      >
                        OK
                      </Button>
                      <Button color="warning" variant="contained">
                        <EditOffIcon onClick={() => setEditing(!editing)} />
                      </Button>
                    </>
                  )}
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleClose}
                  >
                    X
                  </Button>
                </DialogActions>
              </form>
            </>
          )}
          {option === "add" && (
            <>
              <DialogTitle>
                Novo Usuário - {"selectedCustomer.name"}
              </DialogTitle>
              <form onSubmit={handleAdd}>
                <DialogContent>
                  <Typography sx={{ my: 1 }}>Geral</Typography>
                  <TextField
                    label="Nome do Usuário"
                    margin="dense"
                    id="name"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    variant="outlined"
                  />
                  <TextField
                    label="E-mail"
                    margin="dense"
                    id="email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    variant="outlined"
                  />
                  <TextField
                    label="Telefone"
                    margin="dense"
                    id="phone"
                    required
                    fullWidth
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    variant="outlined"
                  />

                  <FormControl sx={{ my: 1, width: 265 }}>
                    <InputLabel>Gerente</InputLabel>
                    <Select
                      value={manager}
                      onChange={(e) => setManager(e.target.value)}
                      label="Gerente"
                      required
                    >
                      {/* {filteredManagers.map((item) => (
                        <MenuItem value={item.name}>{item.name}</MenuItem>
                      ))} */}
                    </Select>
                  </FormControl>

                  <FormControl sx={{ m: 1, width: 125 }}>
                    <InputLabel>Acesso</InputLabel>
                    <Select
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      label="Acesso"
                      required
                    >
                      <MenuItem value={"Comum"}>Comum</MenuItem>
                      <MenuItem value={"Supervisor"}>Supervisor</MenuItem>
                      <MenuItem value={"Admin"}>Admin</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl sx={{ m: 1, width: 125 }}>
                    <InputLabel>Departamento</InputLabel>
                    <Select
                      required
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      label="Departamento"
                    >
                      {/* {filteredDepartments.map((item) => (
                        <MenuItem value={item.name}>{item.name}</MenuItem>
                      ))} */}
                    </Select>
                  </FormControl>
                </DialogContent>
                <DialogActions>
                  <Button type="submit" variant="contained" color="success">
                    OK
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleClose}
                  >
                    X
                  </Button>
                </DialogActions>
              </form>
            </>
          )}
          {option === "delete" && (
            <>
              <DialogTitle>
                {`Deletar Usuário ${selectedUser.name} ?`}
              </DialogTitle>
              <DialogContent>
                <Grid
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  sx={{ my: 4 }}
                >
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleDelete(selectedUser._id)}
                    sx={{ mr: 2 }}
                  >
                    OK
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleClose}
                  >
                    X
                  </Button>
                </Grid>
              </DialogContent>
            </>
          )}
        </Dialog>
      )}
    </>
  );
}
