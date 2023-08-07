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
import { IMaskInput } from "react-imask";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const EditDepartmentForm = ({
  openEdit,
  setOpenEdit,
  selectedCustomer,
  users,
  selectedDepartment,
  fetchData,
}) => {
  const [name, setName] = React.useState(selectedDepartment.name);
  const [phone, setPhone] = React.useState(selectedDepartment.phone);
  const [email, setEmail] = React.useState(selectedDepartment.email);
  const [manager, setManager] = React.useState(selectedDepartment.manager);
  const [members, setMembers] = React.useState(selectedDepartment.members);

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/departments", {
        departmentId: selectedDepartment._id,
        name,
        phone,
        email,
        manager,
        members,
      });
      console.log('res.data', res.data)
      res.data && alert("Editado com sucesso!");
      setOpenEdit(!openEdit);
      fetchData();
    } catch (err) {
      alert("Vish, editei não...");
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleEdit}>
      <DialogTitle>Editando Cliente {selectedCustomer.name}</DialogTitle>
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
              mask="(00) 0000-0000"
              definitions={{
                "#": /[1-9]/,
              }}
              onAccept={(value) => setPhone(value)}
              overwrite
              value={phone}
            />
          </Grid>
          {/* <Grid item sx={{ mt: 3 }}>
            <Typography>Gerente</Typography>
            <TextField
              size="small"
              value={manager}
              required
              onChange={(e) => setManager(e.target.value)}
              sx={{ mr: 1, width: 300 }}
            /> */}
            {/* <FormControl>
              <Select
                onChange={(e) => setManager(e.target.value)}
                value={manager}
                displayEmpty
                sx={{ mt: 1, fontSize: "70%" }}
              >
                {manager.map((item) => (
                  <MenuItem
                    value={item}
                    key={item._id}
                    sx={{ fontSize: "100%" }}
                  >
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl> */}
          {/* </Grid>
          <Grid item sx={{ mt: 3 }}>
            <Typography>Membros</Typography>
            <TextField
              size="small"
              value={members}
              required
              onChange={(e) => setMembers(e.target.value)}
              sx={{ mr: 1, width: 270 }}
            />
          </Grid> */}
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

export default EditDepartmentForm;
