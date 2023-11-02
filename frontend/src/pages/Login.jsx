/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

import {
  Box,
  Button,
  CircularProgress,
  Container,
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
    <Container
      maxWidth="xs"
      sx={{
        mt: 2,
        ml: "37%",
        border: "2px solid #eee",
        borderRadius: 4,
        backgroundColor: "white",
      }}
    >
      <Box
        sx={{
          mt: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img
          src={`http://localhost:3000/static/logo_dog_blue.png`}
          alt="Logo GaiaServer"
          style={{
            margin: 1,
            cursor: "pointer",
          }}
          onClick={() => alert("GS é um sonho feito com muito amor")}
        />
        <Typography component="h1" variant="h5">
          GaiaServer
        </Typography>
        {loading ? (
          <div>
            <CircularProgress color="inherit" sx={{mb:6}} />
          </div>
        ) : (
          <form onSubmit={handleTry} style={{ marginTop: 1 }}>
            <TextField
              size="small"
              required
              fullWidth
              id="email"
              margin="normal"
              label="Usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              size="small"
              margin="dense"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 6 }}
            >
              Login
            </Button>
            {/* <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid> */}
          </form>
        )}
      </Box>
    </Container>
  );
};

export default Login;
