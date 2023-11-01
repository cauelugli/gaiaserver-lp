import React, { useEffect } from "react";
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

export default function App() {
  const [sidebarStatus, setSidebarStatus] = React.useState(false);
  const login = JSON.parse(localStorage.getItem("login"));
  // const userData = JSON.parse(localStorage.getItem("userData"));

  const handleSidebarStatusChange = () => {
    !sidebarStatus
      ? setSidebarStatus(Boolean(true))
      : setSidebarStatus(Boolean(false));
  };

  useEffect(() => {
    const handleUnload = () => {
      console.log("login", login)
      if (login) {
        localStorage.removeItem("userData");
        localStorage.setItem("login", false);
      }
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [login]);

  return (
    <Router>
      <Grid container sx={{ m: -1 }}>
        {login && <NavBar />}
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
              <Button
                onClick={handleSidebarStatusChange}
                sx={{ color: "black" }}
              >
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
                  element={login ? <Dashboard /> : <Navigate to="/login" />}
                />
                <Route path="/login" 
                  element={!login ? <Login /> : <Navigate to="/" />}
                  />
                <Route
                  path="/account"
                  element={login ? <Account /> : <Navigate to="/login" />}
                />
                <Route
                  path="/users"
                  element={login ? <Users /> : <Navigate to="/login" />}
                />
                <Route
                  path="/customers"
                  element={login ? <Customers /> : <Navigate to="/login" />}
                />
                <Route
                  path="/departments"
                  element={
                    login ? <Departments /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/services"
                  element={login ? <Services /> : <Navigate to="/login" />}
                />
                <Route
                  path="/stock"
                  element={login ? <Stock /> : <Navigate to="/login" />}
                />
                <Route
                  path="/requests"
                  element={login ? <Requests /> : <Navigate to="/login" />}
                />
                <Route
                  path="/files"
                  element={login ? <Files /> : <Navigate to="/login" />}
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
