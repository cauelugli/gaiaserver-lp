/* eslint-disable no-unused-vars */
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

const EditOperatorForm = ({
  option,
  openEdit,
  selectedOperator,
  setOpenEdit,
  fetchData,
  toast,
}) => {
  const [username, setUsername] = React.useState(selectedOperator.username);
  const [role, setRole] = React.useState(selectedOperator.role);
  const [password, setPassword] = React.useState("");
  const [password2, setPassword2] = React.useState("");

  const handleEdit = async (e) => {
    e.preventDefault();
    function arePasswordsEqual(password, password2) {
      return password === password2;
    }

    try {
      if (option === "operator") {
        const res = await api.put("/operators", {
          operatorId: selectedOperator._id,
          operator: selectedOperator,
          username,
          role,
          option
        });
        if (res.data) {
          toast.success("Operador Editado!", {
            closeOnClick: true,
            pauseOnHover: false,
            theme: "colored",
            autoClose: 1200,
          });
        }
        setOpenEdit(!openEdit);
        fetchData();
      } else if (option === "password") {
        if (arePasswordsEqual(password, password2)) {
          const res = await api.put("/operators", {
            operatorId: selectedOperator._id,
            operator: selectedOperator,
            password,
            option
          });
          if (res.data) {
            toast.success("Senha Atualizada!", {
              closeOnClick: true,
              pauseOnHover: false,
              theme: "colored",
              autoClose: 1200,
            });
          }
          setOpenEdit(!openEdit);
          fetchData();
        } else {
          toast.error("As senhas não são iguais", {
            closeOnClick: true,
            pauseOnHover: false,
            theme: "colored",
            autoClose: 1200,
          });
        }
      }
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
      <DialogTitle>
        {option === "operator" && (
          <Typography variant="h6"> Editando Operador - {selectedOperator.name}</Typography>
        )}
        {option === "password" && (
          <Typography variant="h6"> Alterar Senha - {selectedOperator.name}</Typography>
        )}
      </DialogTitle>
      <DialogContent>
        {option === "operator" && (
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Grid item>
              <Avatar
                alt="Imagem do Usuário"
                src={`http://localhost:3000/static/${selectedOperator.image}`}
                sx={{
                  width: 200,
                  height: 200,
                }}
              />
            </Grid>

            <Grid item sx={{ mt: 2 }}>
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                <Grid item sx={{ mr: 1 }}>
                  <Typography>Nome de Operador</Typography>
                  <TextField
                    size="small"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    sx={{ mt: 1, width: 250 }}
                  />
                </Grid>
                <Grid item>
                  <Typography sx={{ mb: 1 }}>Nível de Acesso</Typography>
                  <Select
                    onChange={(e) => setRole(e.target.value)}
                    value={role}
                    size="small"
                    sx={{ width: 245 }}
                  >
                    <MenuItem
                      value={"Colaborador"}
                      disabled={selectedOperator.role === "Gerente"}
                    >
                      Colaborador
                    </MenuItem>
                    <MenuItem
                      value={"Supervisor"}
                      disabled={selectedOperator.role === "Gerente"}
                    >
                      Supervisor
                    </MenuItem>
                    <MenuItem value={"Gerente"}>Gerente</MenuItem>
                  </Select>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}

        {option === "password" && (
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Grid item>
              <Avatar
                alt="Imagem do Usuário"
                src={`http://localhost:3000/static/${selectedOperator.image}`}
                sx={{
                  width: 200,
                  height: 200,
                }}
              />
            </Grid>

            <Grid item sx={{ mt: 2 }}>
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                <Grid item sx={{ mr: 1 }}>
                  <Typography>Nova Senha</Typography>
                  <TextField
                    size="small"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    sx={{ mt: 1, width: 250 }}
                  />
                </Grid>
                <Grid item sx={{ mr: 1 }}>
                  <Typography>Repita a Senha</Typography>
                  <TextField
                    size="small"
                    type="password"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                    required
                    sx={{ mt: 1, width: 250 }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}
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

export default EditOperatorForm;
