/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

import {
  Button,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const Login = () => {
  const [loginOrNew, setLoginOrNew] = useState(true);

  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("1234");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFirstAccess, setIsFirstAccess] = useState(false);
  const [isFirstAccessUserId, setIsFirstAccessUserId] = useState(null);
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
        if (res.data.isFirstAccess) {
          setIsFirstAccess(true);
          setIsFirstAccessUserId(res.data._id);
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
      const res = await api.post("/new", {
        username,
        password,
        email,
      });
      if (res.data) {
        toast.success("Usuário Criado!", {
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
      const res = await api.put("/users/changePassFirstAccess", {
        userId: isFirstAccessUserId,
        password: newPassword,
      });
      if (res.data) {
        toast.success(
          "Senha atualizada com sucesso! Reinicie o navegador e acesse o sistema.",
          {
            closeOnClick: true,
            pauseOnHover: false,
            theme: "colored",
            autoClose: 4000,
          }
        );
      }
      setIsFirstAccess(false);
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
    <Grid
      container
      direction="row"
      alignItems="center"
      justifyContent="space-evenly"
      sx={{ mt: loginOrNew ? "10%" : "5%", ml: "5em" }}
    >
      <Grid
        container
        item
        xs={5}
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <img
          src={`http://localhost:3000/static/logo_dog_blue.png`}
          alt="Logo GaiaServer"
          style={{ cursor: "pointer" }}
          onClick={() => alert("GS é um sonho feito com muito amor")}
        />
        <Typography
          component="h1"
          variant="h4"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          GaiaServer
        </Typography>
      </Grid>
      <Grid
        container
        item
        xs={5}
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
            {isFirstAccess ? (
              <form onSubmit={handleNewPassword}>
                <Grid
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
                </Grid>
              </form>
            ) : (
              <>
                {loginOrNew ? (
                  <form onSubmit={handleTry}>
                    <Grid
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
                    </Grid>
                  </form>
                ) : (
                  <form onSubmit={handleTryNew}>
                    <Grid
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
                      <TextField
                        size="small"
                        required
                        label="E-mail"
                        variant="standard"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                    </Grid>
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
      </Grid>
    </Grid>
  );
};

export default Login;
