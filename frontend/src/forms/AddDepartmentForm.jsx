import React from "react";
import axios from "axios";

import {
  Box,
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const AddDepartmentForm = () => {
  const [customer, setCustomer] = React.useState("");
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [manager, setManager] = React.useState("");
  const [members, setMembers] = React.useState("");

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/departments", {
        customer,
        name,
        phone,
        email,
        manager,
        members,
      });
      res.data && alert("Departamento Adicionado!");
      //   setOpenAdd(!openAdd);
    } catch (err) {
      alert("Vish, deu não...");
      console.log(err);
    }
    // try {
    //   const response = await api.get("/customers");
    //   setCustomers(response.data);
    // } catch (error) {
    //   console.error("Error fetching data:", error);
    // }
  };

  return (
    <form onSubmit={handleAdd}>
      <DialogContent>
        <Typography sx={{ my: 1 }}>Geral</Typography>
        <TextField
          label="Cliente"
          margin="dense"
          variant="outlined"
          value={customer}
          required
          onChange={(e) => setCustomer(e.target.value)}
          sx={{ mr: 1, width: 240 }}
        />
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
          //   onClick={() => setOpenAdd(!openAdd)}
        >
          X
        </Button>
      </DialogActions>
    </form>
  );
};

export default AddDepartmentForm;
