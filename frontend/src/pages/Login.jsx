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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTry = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post("/login", {
        username,
        password,
      });
      if (res.data) {
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

  return (
    <Grid
      container
      direction="row"
      alignItems="center"
      justifyContent="space-evenly"
      sx={{ mt: "10%", ml: "5em" }}
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
          <form onSubmit={handleTry}>
            <Grid container direction="column" sx={{ mt: 8 }}>
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
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 6, width: "50%", backgroundColor: "#32aacd" }}
              >
                Login
              </Button>
            </Grid>
          </form>
        )}
      </Grid>
    </Grid>
  );
};

export default Login;
