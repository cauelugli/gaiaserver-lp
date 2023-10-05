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
  Select,
  TextField,
  Typography,
} from "@mui/material";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const AddOperatorForm = ({
  openAdd,
  operators,
  setOpenAdd,
  fetchData,
  toast,
}) => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [operator, setOperator] = React.useState("");

  const handleOperatorChange = (e) => {
    const selectedOperator = e.target.value;
    setOperator(selectedOperator);

    const usernameSuggestion = selectedOperator
      ? selectedOperator.name
          .split(" ")
          .map((namePart) => namePart.toLowerCase())
          .join(".")
      : "";
    setUsername(usernameSuggestion);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/operators", {
        id: operator._id,
        username,
        password,
        operator
      });
      if (res.data) {
        toast.success("Operador Adicionado!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
      setOpenAdd(!openAdd);
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
        console.log("err", err);
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
    <form onSubmit={handleAdd}>
      <DialogTitle sx={{ mb: 1 }}>Novo Operador</DialogTitle>
      <DialogContent sx={{ pl: 5 }}>
        <Typography sx={{ mb: 1 }}>Colaborador</Typography>
        <Select
          onChange={handleOperatorChange}
          value={operator}
          renderValue={(selected) => selected.name}
          size="small"
          sx={{ width: "93%" }}
        >
          {operators.map((item) => (
            <MenuItem value={item} key={item.id}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
        <Grid
          container
          sx={{ mt: 2 }}
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Grid item>
            <Typography sx={{ my: 1 }}>Nome de Usuário</Typography>
            <TextField
              size="small"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              sx={{ mr: 1 }}
            />
          </Grid>
          <Grid item>
            <Typography sx={{ my: 1 }}>Senha</Typography>
            <TextField
              size="small"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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
          onClick={() => setOpenAdd(!openAdd)}
        >
          X
        </Button>
      </DialogActions>
    </form>
  );
};

export default AddOperatorForm;
