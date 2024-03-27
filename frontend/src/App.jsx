/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { io } from "socket.io-client";
const socket = io("http://localhost:3000");

import { Grid, Typography } from "@mui/material";

import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";

import Account from "./pages/Account";
import Config from "./pages/Config";
import Customers from "./pages/Customers";
import Dashboard from "./pages/Dashboard";
import Departments from "./pages/Departments";
import Files from "./pages/Files";
import Finance from "./pages/Finance";
import Login from "./pages/Login";
import Projects from "./pages/Projects";
import Quotes from "./pages/Quotes";
import Reports from "./pages/Reports";
import Requests from "./pages/Requests";
import Services from "./pages/Services";
import Stock from "./pages/Stock";
import Users from "./pages/Users";
import Home from "./pages/Home";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

function isAuthenticated(login, userData) {
  return login && userData;
}

function hasPermission(user, configData, routePath) {
  if (!configData.sidebar) return false;
  if (user.role.name === "Admin") return true;

  const allowedRoles = configData.sidebar[routePath];

  return allowedRoles && allowedRoles.some((role) => role._id === user.role.id);
}

function darkenColor(hex, factor) {
  hex = hex.replace(/^#/, "");
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  const newR = Math.max(0, Math.round(r - factor));
  const newG = Math.max(0, Math.round(g - factor));
  const newB = Math.max(0, Math.round(b - factor));

  const darkenedHex = `#${((newR << 16) | (newG << 8) | newB)
    .toString(16)
    .padStart(6, "0")}`;

  return darkenedHex;
}

export default function App() {
  const [configData, setConfigData] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const darkenedColor = darkenColor(
    configData && configData.customization && configData.customization.mainColor
      ? configData.customization.mainColor
      : "32aacd",
    25
  );
  const [configTables, setConfigTables] = useState(null);
  const [configAgenda, setConfigAgenda] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [requests, setRequests] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [users, setUsers] = useState([]);
  const [userKey, setUserKey] = useState(0);
  const login = JSON.parse(sessionStorage.getItem("login"));
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  console.log("App mounted control");

  useEffect(() => {
    socket.on("forceRefresh", () => {
      toast.info("Atualização necessária! Recarregando a página em 10 segundos", {
        closeOnClick: false,
        pauseOnHover: false,
        theme: "colored",
        autoClose: 9500,
      });

      const timer = setTimeout(() => {
        window.location.reload();
      }, 10000);

      return () => {
        clearTimeout(timer);
      };
    });

    return () => {
      socket.off("forceRefresh");
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = await api.get("/config");
        const configTables = await api.get("/config/tables");
        const configAgenda = await api.get("/config/agenda");
        const notifications = await api.get(
          `/managers/notifications/${userData._id}`
        );
        setConfigData(config.data[0]);
        setConfigTables(configTables.data);
        setConfigAgenda(configAgenda.data);
        setNotifications(notifications.data);

        const resUsers = await api.get("/users");
        const resManagers = await api.get("/managers");
        const usersCombinedData = [...resUsers.data, ...resManagers.data];
        setUsers(usersCombinedData)

        const resJobs = await api.get("/jobs");
        const resSales = await api.get("/sales");
        const requestsCombinedData = [...resJobs.data, ...resSales.data];
        setRequests(requestsCombinedData)

        const resCustomers = await api.get("/customers");
        const resClients = await api.get("/clients");
        const customersCombinedData = [...resCustomers.data, ...resClients.data];
        setCustomers(customersCombinedData)
        
        if (userData.hasDarkModeActive) {
          setDarkMode(true);
        }
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
  }, [login, userData, userKey]);

  useEffect(() => {
    const handleUnload = () => {
      const readNotifications = Object.values(userData.notifications)
        .filter((notification) => notification.status === "Lida")
        .map((notification) => notification._id);

      if (readNotifications.length > 0) {
        localStorage.setItem(
          "readNotifications",
          JSON.stringify(readNotifications)
        );
      }
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [userData]);

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
    <Grid sx={{ width: "auto", height: "auto", m: -1, mr: -2 }}>
      <Router>
        <Grid container>
          {login && (
            <NavBar
              socket={socket}
              user={userData}
              configData={configData}
              notifications={notifications}
              setNotifications={setNotifications}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              darkenedColor={darkenedColor}
            />
          )}
          {login && (
            <Grid
              item
              sx={{
                textAlign: "center",
                backgroundColor: darkMode ? darkenedColor : "white",
                height: "auto",
                maxWidth: 58,
              }}
            >
              <SideBar
                configData={configData}
                user={userData}
                darkMode={darkMode}
                darkenedColor={darkenedColor}
              />
            </Grid>
          )}

          <Grid
            sx={{
              width: "95%",
              backgroundColor: darkMode ? "#181c24" : "",
            }}
          >
            <Grid container sx={{ p: 2 }}>
              <Grid item xs={12} xl={12}>
                <Routes>
                  <Route
                    path="/"
                    element={
                      isAuthenticated(login, userData) ? (
                        <Home
                          user={userData}
                          configDashboard={configData.dashboard}
                        />
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
                    path="/dashboard"
                    element={
                      isAuthenticated(login, userData) ? (
                        <Dashboard
                          user={userData}
                          users={users}
                          requests={requests}
                          customers={customers}
                          configAgenda={configAgenda}
                          configDashboard={configData.dashboard}
                          configCustomization={configData.customization}
                        />
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
                        <Customers
                          user={userData}
                          configAgenda={configAgenda}
                          configTables={configTables}
                        />
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
                        <Departments
                          user={userData}
                          configTables={configTables}
                        />
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
                    path="/reports"
                    element={
                      isAuthenticated(login, userData) &&
                      hasPermission(userData, configData, "departments") ? (
                        <Reports
                          user={userData}
                          users={users}
                          requests={requests}
                          customers={customers}
                        />
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
                        <Services
                          user={userData}
                          configTables={configTables}
                          configData={configData}
                        />
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
                        <Stock user={userData} configTables={configTables} />
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
                        <Requests
                          user={userData}
                          configTables={configTables}
                          configAgenda={configAgenda}
                        />
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
                    path="/projects"
                    element={
                      isAuthenticated(login, userData) &&
                      hasPermission(userData, configData, "projects") ? (
                        <Projects user={userData} configTables={configTables} />
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
                        <Quotes
                          user={userData}
                          configData={configData.quotes}
                        />
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
    </Grid>
  );
}
