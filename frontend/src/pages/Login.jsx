// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

import {
  Button,
  CircularProgress,
  Grid2,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const Login = () => {
  const [loginOrNew, setLoginOrNew] = useState(true);

  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("1234");
  const [loading, setLoading] = useState(false);
  const [alreadyLogin, setAlreadyLogin] = useState(false);
  const [alreadyLoginUserId, setAlreadyLoginUserId] = useState(null);
  const [newPassword, setNewPassword] = useState("");

  const handleTry = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post("/login", {
        username,
        password,
      });
      if (res.data) {
        if (res.data.alreadyLogin === false) {
          setAlreadyLogin(true);
          setAlreadyLoginUserId(res.data._id);
          setLoading(false);
          toast.warning(
            "É necessária Alteração de Senha em seu Primeiro Acesso",
            {
              closeOnClick: true,
              pauseOnHover: false,
              theme: "colored",
              autoClose: 2000,
            }
          );
        } else {
          sessionStorage.setItem("userData", JSON.stringify(res.data));
          sessionStorage.setItem("login", true);
          toast.success("Login OK!", {
            closeOnClick: true,
            pauseOnHover: false,
            theme: "colored",
            autoClose: 200,
          });

          setTimeout(() => {
            setLoading(false);
            window.location.reload();
          }, 1000);
        }
      }
    } catch (err) {
      setLoading(false);

      if (err.response.status === 401) {
        toast.error("Usuário Incorreto", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      } else {
        toast.error("Senha Incorreta", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
    }
  };

  const handleTryNew = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post("/admin/createAdminUser", {
        password,
      });
      if (res.data) {
        toast.success("Usuário Admin Criado!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 2000,
        });
      }
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.status === 422) {
        toast.error(err.response.data.error, {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
        setLoginOrNew(true);
        setPassword("");
      }
    }
  };

  const handleNewPassword = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.put("/auth/changePassFirstAccess", {
        userId: alreadyLoginUserId,
        password: newPassword,
      });
      if (res.data) {
        toast.success(
          "Senha atualizada com sucesso! Você já pode acessar o sistema.",
          {
            closeOnClick: true,
            pauseOnHover: false,
            theme: "colored",
            autoClose: 4000,
          }
        );
      }
      setAlreadyLogin(false);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error("Falha ao atualizar senha", {
        closeOnClick: true,
        pauseOnHover: false,
        theme: "colored",
        autoClose: 1200,
      });
    }
  };

  return (
    <Grid2
      container
      direction="row"
      alignItems="center"
      justifyContent="space-evenly"
      sx={{ width: "98vw", mt: "12vw" }}
    >
      <Grid2
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Tooltip title={"o GS é um sonho feito com muito amor"}>
          <img
            src={`http://localhost:8080/static/${
              loading ? "logo_dog_blue_thinking" : "logo_dog_blue"
            }.png`}
            alt="Logo GaiaServer"
            style={{ cursor: "pointer" }}
            onClick={() => alert("o GS é um sonho feito com muito amor")}
          />
        </Tooltip>
        <Typography component="h1" variant="h4">
          GaiaServer
        </Typography>
      </Grid2>
      <Grid2
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        {loading ? (
          <div>
            <CircularProgress color="inherit" sx={{ mb: 6, pb: 20 }} />
          </div>
        ) : (
          <>
            {alreadyLogin ? (
              <form onSubmit={handleNewPassword}>
                <Grid2
                  container
                  direction="column"
                  alignItems="center"
                  sx={{ mt: 8 }}
                >
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Defina uma nova senha
                  </Typography>
                  <TextField
                    size="small"
                    required
                    label="Nova Senha"
                    variant="standard"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    sx={{ mb: 1 }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 3, backgroundColor: "#32aacd" }}
                  >
                    Atualizar Senha
                  </Button>
                </Grid2>
              </form>
            ) : (
              <>
                {loginOrNew ? (
                  <form onSubmit={handleTry}>
                    <Grid2
                      container
                      direction="column"
                      alignItems="center"
                      sx={{ mt: 8 }}
                    >
                      <TextField
                        size="small"
                        required
                        label="Usuário"
                        variant="standard"
                        sx={{ mb: 1 }}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                      <TextField
                        size="small"
                        required
                        label="Senha"
                        variant="standard"
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <Button
                        autoFocus
                        type="submit"
                        variant="contained"
                        sx={{
                          mt: 3,
                          mb: 6,
                          width: "50%",
                          backgroundColor: "#32aacd",
                        }}
                      >
                        Login
                      </Button>
                    </Grid2>
                  </form>
                ) : (
                  <form onSubmit={handleTryNew}>
                    <Grid2
                      container
                      direction="column"
                      alignItems="center"
                      sx={{ mt: 8 }}
                    >
                      <TextField
                        size="small"
                        disabled
                        label="Usuário"
                        variant="standard"
                        value="admin"
                      />
                      <TextField
                        sx={{ my: 1 }}
                        size="small"
                        required
                        label="Senha"
                        variant="standard"
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <Button
                        type="submit"
                        variant="contained"
                        sx={{
                          mt: 2,
                          backgroundColor: "#32aacd",
                        }}
                      >
                        Registrar
                      </Button>
                    </Grid2>
                  </form>
                )}
              </>
            )}

            <Typography
              onClick={() => setLoginOrNew(!loginOrNew)}
              sx={{ mt: 3, mb: 2, cursor: "pointer", color: "#5F9EA0" }}
            >
              {loginOrNew ? "+ criar novo" : "realizar login"}
            </Typography>
          </>
        )}
      </Grid2>
    </Grid2>
  );
};

export default Login;
