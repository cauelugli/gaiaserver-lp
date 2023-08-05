/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";

import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const AddDepartmentForm = ({
  selectedCustomer,
  openAdd,
  setOpenAdd,
  fetchData,
}) => {
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [manager, setManager] = React.useState("");
  const [members, setMembers] = React.useState("");

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/departments", {
        customerId: selectedCustomer._id,
        name,
        phone,
        email,
        manager,
        members,
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
    <form onSubmit={handleAdd}>
      <DialogTitle>Novo Departamento - {selectedCustomer.name}</DialogTitle>
      <DialogContent>
        <TextField
          label="Nome"
          margin="dense"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          variant="outlined"
          sx={{ mr: 1, width: 700 }}
        />
        <TextField
          label="Telefone"
          margin="dense"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          variant="outlined"
          sx={{ mr: 1, width: 160 }}
        />

        <TextField
          label="Email"
          margin="dense"
          variant="outlined"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mr: 1, width: 285 }}
        />
        <TextField
          label="Gerente"
          margin="dense"
          variant="outlined"
          value={manager}
          required
          onChange={(e) => setManager(e.target.value)}
          sx={{ mr: 1, width: 285 }}
        />
        <TextField
          label="Membros"
          margin="dense"
          value={members}
          onChange={(e) => setMembers(e.target.value)}
          required
          variant="outlined"
          sx={{ mr: 1, width: 270 }}
        />
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

export default AddDepartmentForm;
