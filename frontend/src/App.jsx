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

import { Box, Button, Grid } from "@mui/material";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

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

function isAuthenticated(login, userData) {
  return login && userData && userData.isActive;
}

export default function App() {
  const [sidebarStatus, setSidebarStatus] = useState(false);
  const login = JSON.parse(sessionStorage.getItem("login"));
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  console.log("App mounted control")

  const handleSidebarStatusChange = () => {
    setSidebarStatus(!sidebarStatus);
  };

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
      if (!sessionStorage.getItem("login") && !sessionStorage.getItem("userData")) {
        sessionStorage.setItem("login", JSON.stringify(true));
        sessionStorage.setItem("userData", JSON.stringify(userData));
      }
    }
  }, [userData]);

  return (
    <Router>
      <Grid container sx={{ m: -1 }}>
        {login && <NavBar user={userData}/>}
        {login && (
          <Grid
            item
            xs={sidebarStatus ? 1.5 : 0.6}
            xl={sidebarStatus ? 1.2 : 0.4}
            sx={{
              textAlign: "center",
              backgroundColor: "#32aacd",
              minHeight: "50vw",
            }}
          >
            <Box>
              <Button onClick={handleSidebarStatusChange} sx={{ color: "black", my:-1}}>
                {sidebarStatus ? <ChevronLeftIcon /> : <ChevronRightIcon />}
              </Button>
              <SideBar sidebarOpen={sidebarStatus} />
            </Box>
          </Grid>
        )}

        <Grid sx={{ width: "87%" }}>
          <Grid container sx={{ p: 2 }}>
            <Grid item xs={12} xl={12}>
              <Routes>
                <Route
                  path="/"
                  element={isAuthenticated(login, userData) ? <Dashboard user={userData}/> : <Navigate to="/login" />}
                />
                <Route
                  path="/login"
                  element={!login ? <Login /> : <Navigate to="/" />}
                />
                <Route
                  path="/account"
                  element={isAuthenticated(login, userData) ? <Account user={userData}/> : <Navigate to="/login" />}
                />
                <Route
                  path="/users"
                  element={isAuthenticated(login, userData) ? <Users user={userData}/> : <Navigate to="/login" />}
                />
                <Route
                  path="/customers"
                  element={isAuthenticated(login, userData) ? <Customers user={userData}/> : <Navigate to="/login" />}
                />
                <Route
                  path="/departments"
                  element={isAuthenticated(login, userData) ? <Departments user={userData}/> : <Navigate to="/login" />}
                />
                <Route
                  path="/services"
                  element={isAuthenticated(login, userData) ? <Services user={userData}/> : <Navigate to="/login" />}
                />
                <Route
                  path="/stock"
                  element={isAuthenticated(login, userData) ? <Stock user={userData}/> : <Navigate to="/login" />}
                />
                <Route
                  path="/requests"
                  element={isAuthenticated(login, userData) ? <Requests user={userData}/> : <Navigate to="/login" />}
                />
                <Route
                  path="/quotes"
                  element={isAuthenticated(login, userData) ? <Quotes user={userData}/> : <Navigate to="/login" />}
                />
                <Route
                  path="/files"
                  element={isAuthenticated(login, userData) ? <Files user={userData}/> : <Navigate to="/login" />}
                />
                <Route
                  path="/finance"
                  element={isAuthenticated(login, userData) ? <Finance user={userData}/> : <Navigate to="/login" />}
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
