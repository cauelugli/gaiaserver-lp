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

import { Box, Button, Grid } from "@mui/material";

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
              backgroundColor: configData && configData.customization
                ? configData.customization.mainColor
                : "32aacd",
              height: "auto",
              maxWidth:60
            }}
          >
            <Box>
              <SideBar configData={configData} />
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
                    isAuthenticated(login, userData) ? (
                      <Users user={userData} />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/customers"
                  element={
                    isAuthenticated(login, userData) ? (
                      <Customers user={userData} />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/departments"
                  element={
                    isAuthenticated(login, userData) ? (
                      <Departments user={userData} />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/services"
                  element={
                    isAuthenticated(login, userData) ? (
                      <Services user={userData} />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/stock"
                  element={
                    isAuthenticated(login, userData) ? (
                      <Stock user={userData} />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/requests"
                  element={
                    isAuthenticated(login, userData) ? (
                      <Requests user={userData} />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/quotes"
                  element={
                    isAuthenticated(login, userData) ? (
                      <Quotes user={userData} />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/files"
                  element={
                    isAuthenticated(login, userData) ? (
                      <Files user={userData} />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/finance"
                  element={
                    isAuthenticated(login, userData) ? (
                      <Finance user={userData} />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/config"
                  element={
                    isAuthenticated(login, userData) ? (
                      <Config user={userData} />
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
