/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

import { Button, CircularProgress, TextField } from "@mui/material";

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
        localStorage.setItem("userData", JSON.stringify(res.data));
        localStorage.setItem("login", true);
        toast.success("Login OK!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
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
    <>
      {loading ? (
        <div>
          <CircularProgress color="inherit" />
        </div>
      ) : (
        <form onSubmit={handleTry}>
          <TextField
            size="small"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            size="small"
            label="Pass"
            type="password"
            sx={{mx:1}}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" variant="contained" color="success">
            OK
          </Button>
        </form>
      )}
    </>
  );
};

export default Login;
