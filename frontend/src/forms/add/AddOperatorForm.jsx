/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";

import {
  Avatar,
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
  const [role, setRole] = React.useState("Colaborador");

  const handleOperatorChange = (e) => {
    const selectedOperator = e.target.value;
    setOperator(selectedOperator);
    if (selectedOperator.role === "Gerente") {
      setRole("Gerente");
    }

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
        operatorId: operator._id,
        username,
        password,
        role,
        operator,
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
        <Grid
          container
          sx={{ mt: 2 }}
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Grid item>
            <Typography sx={{ mb: 1 }}>Colaborador</Typography>
            <Select
              onChange={handleOperatorChange}
              value={operator}
              renderValue={(selected) => (
                <Grid container direction="row">
                  <Avatar
                    alt="Imagem do Colaborador"
                    src={`http://localhost:3000/static/${selected.image}`}
                    sx={{ width: 22, height: 22, mr: 2 }}
                  />
                  {selected.name}
                </Grid>
              )}
              size="small"
              sx={{ mr: 1, width: 245 }}
            >
              {operators.map((item) => (
                <MenuItem value={item} key={item.id}>
                  <Avatar
                    alt="Imagem do Colaborador"
                    src={`http://localhost:3000/static/${item.image}`}
                    sx={{ width: 22, height: 22, mr: 2 }}
                  />
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item>
            <Typography sx={{ mb: 1 }}>Nível de Acesso</Typography>
            <Select
              onChange={(e) => setRole(e.target.value)}
              value={role}
              size="small"
              sx={{ width: 245 }}
            >
              {}
              <MenuItem
                value={"Colaborador"}
                disabled={operator.role === "Gerente"}
              >
                Colaborador
              </MenuItem>
              <MenuItem
                value={"Supervisor"}
                disabled={operator.role === "Gerente"}
              >
                Supervisor
              </MenuItem>
              <MenuItem value={"Gerente"}>Gerente</MenuItem>
            </Select>
          </Grid>
        </Grid>
        <Grid
          container
          sx={{ mt: 3 }}
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
