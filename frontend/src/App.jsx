/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import { Box, Button, Grid, Typography } from "@mui/material";

import SideBar from "./components/SideBar";
import NavBar from "./components/NavBar";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Requests from "./pages/Requests";
import Customers from "./pages/Customers";
import Departments from "./pages/Departments";
import Services from "./pages/Services";
import Stock from "./pages/Stock";
import Files from "./pages/Files";
import Account from "./pages/Account";
import Quotes from "./pages/Quotes";
import Finance from "./pages/Finance";
import Config from "./pages/Config";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

function isAuthenticated(login, userData) {
  return login && userData && userData.isActive;
}

function hasPermission(user, configData, routePath) {
  if (!configData.sidebar) return false;
  if (user.role.name === "Admin") return true;

  const allowedRoles = configData.sidebar[routePath];

  return allowedRoles && allowedRoles.some((role) => role._id === user.role.id);
}

export default function App() {
  const [configData, setConfigData] = useState([]);
  const login = JSON.parse(sessionStorage.getItem("login"));
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  console.log("App mounted control");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = await api.get("/config");
        setConfigData(config.data[0]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (window.location.pathname === "/login") {
      sessionStorage.clear();
    }
  }, []);

  useEffect(() => {
    const handleUnload = () => {
      if (login && userData) {
        sessionStorage.setItem("keepData", "true");
      }
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [login, userData]);

  useEffect(() => {
    const keepData = sessionStorage.getItem("keepData");
    if (keepData === "true") {
      if (
        !sessionStorage.getItem("login") &&
        !sessionStorage.getItem("userData")
      ) {
        sessionStorage.setItem("login", JSON.stringify(true));
        sessionStorage.setItem("userData", JSON.stringify(userData));
      }
    }
  }, [userData]);

  return (
    <Router>
      <Grid container sx={{ m: -1 }}>
        {login && <NavBar user={userData} configData={configData} />}
        {login && (
          <Grid
            item
            sx={{
              textAlign: "center",
              backgroundColor:
                configData && configData.customization
                  ? configData.customization.mainColor
                  : "32aacd",
              height: "auto",
              maxWidth: 60,
            }}
          >
            <Box>
              <SideBar configData={configData} user={userData} />
            </Box>
          </Grid>
        )}

        <Grid sx={{ width: "87%" }}>
          <Grid container sx={{ p: 2 }}>
            <Grid item xs={12} xl={12}>
              <Routes>
                <Route
                  path="/"
                  element={
                    isAuthenticated(login, userData) ? (
                      <Dashboard user={userData} />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/login"
                  element={!login ? <Login /> : <Navigate to="/" />}
                />
                <Route
                  path="/account"
                  element={
                    isAuthenticated(login, userData) ? (
                      <Account user={userData} />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/users"
                  element={
                    isAuthenticated(login, userData) &&
                    hasPermission(userData, configData, "users") ? (
                      <Users user={userData} />
                    ) : isAuthenticated(login, userData) ? (
                      <Typography sx={{ m: 2, fontSize: 16 }}>
                        Seu usuário não possui autorização à página.
                      </Typography>
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/customers"
                  element={
                    isAuthenticated(login, userData) &&
                    hasPermission(userData, configData, "customers") ? (
                      <Customers user={userData} />
                    ) : isAuthenticated(login, userData) ? (
                      <Typography sx={{ m: 2, fontSize: 16 }}>
                        Seu usuário não possui autorização à página.
                      </Typography>
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/departments"
                  element={
                    isAuthenticated(login, userData) &&
                    hasPermission(userData, configData, "departments") ? (
                      <Departments user={userData} />
                    ) : isAuthenticated(login, userData) ? (
                      <Typography sx={{ m: 2, fontSize: 16 }}>
                        Seu usuário não possui autorização à página.
                      </Typography>
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/services"
                  element={
                    isAuthenticated(login, userData) &&
                    hasPermission(userData, configData, "services") ? (
                      <Services user={userData} />
                    ) : isAuthenticated(login, userData) ? (
                      <Typography sx={{ m: 2, fontSize: 16 }}>
                        Seu usuário não possui autorização à página.
                      </Typography>
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/stock"
                  element={
                    isAuthenticated(login, userData) &&
                    hasPermission(userData, configData, "stock") ? (
                      <Stock user={userData} />
                    ) : isAuthenticated(login, userData) ? (
                      <Typography sx={{ m: 2, fontSize: 16 }}>
                        Seu usuário não possui autorização à página.
                      </Typography>
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/requests"
                  element={
                    isAuthenticated(login, userData) &&
                    hasPermission(userData, configData, "requests") ? (
                      <Requests user={userData} />
                    ) : isAuthenticated(login, userData) ? (
                      <Typography sx={{ m: 2, fontSize: 16 }}>
                        Seu usuário não possui autorização à página.
                      </Typography>
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/quotes"
                  element={
                    isAuthenticated(login, userData) &&
                    hasPermission(userData, configData, "quotes") ? (
                      <Quotes user={userData} />
                    ) : isAuthenticated(login, userData) ? (
                      <Typography sx={{ m: 2, fontSize: 16 }}>
                        Seu usuário não possui autorização à página.
                      </Typography>
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/files"
                  element={
                    isAuthenticated(login, userData) &&
                    hasPermission(userData, configData, "files") ? (
                      <Files user={userData} />
                    ) : isAuthenticated(login, userData) ? (
                      <Typography sx={{ m: 2, fontSize: 16 }}>
                        Seu usuário não possui autorização à página.
                      </Typography>
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/finance"
                  element={
                    isAuthenticated(login, userData) &&
                    hasPermission(userData, configData, "finance") ? (
                      <Finance user={userData} />
                    ) : isAuthenticated(login, userData) ? (
                      <Typography sx={{ m: 2, fontSize: 16 }}>
                        Seu usuário não possui autorização à página.
                      </Typography>
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/config"
                  element={
                    isAuthenticated(login, userData) &&
                    hasPermission(userData, configData, "config") ? (
                      <Config user={userData} />
                    ) : isAuthenticated(login, userData) ? (
                      <Typography sx={{ m: 2, fontSize: 16 }}>
                        Seu usuário não possui autorização à página.
                      </Typography>
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
              </Routes>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <ToastContainer />
    </Router>
  );
}
