import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import { Box, Button, Grid } from "@mui/material";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import SideBar from "./components/SideBar";

import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Requests from "./pages/Requests";
import Customers from "./pages/Customers";
import Departments from "./pages/Departments";
import Services from "./pages/Services";
import Stock from "./pages/Stock";
import NavBar from "./components/NavBar";
import Files from "./pages/Files";
import Account from "./pages/Account";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function App() {
  const [sidebarStatus, setSidebarStatus] = React.useState(false);

  const [customers, setCustomers] = useState([]);

  const [selectedCustomer, setSelectedCustomer] = useState("");

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const customers = await api.get("/customers");
        setCustomers(customers.data);
        selectedCustomer === "" && setSelectedCustomer(customers.data[0]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [selectedCustomer, customers]);

  const handleSidebarStatusChange = () => {
    !sidebarStatus
      ? setSidebarStatus(Boolean(true))
      : setSidebarStatus(Boolean(false));
  };

  return (
    <Router >
      <Grid container sx={{ m: -1 }}>
        <NavBar/>
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
            <Button onClick={handleSidebarStatusChange} sx={{ color: "black" }}>
              {sidebarStatus ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </Button>
            <SideBar sidebarOpen={sidebarStatus} />
          </Box>
        </Grid>

        <Grid sx={{ width: "87%" }}>
          <Grid container sx={{ p: 2 }}>
            <Grid item xs={12} xl={12}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                {/* <Route path="/login" element={<Login />} /> */}
                <Route path="/account" element={<Account />} />
                <Route path="/users" element={<Users />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/departments" element={<Departments />} />
                <Route path="/services" element={<Services />} />
                <Route path="/stock" element={<Stock />} />
                <Route path="/requests" element={<Requests />} />
                <Route path="/files" element={<Files />} />
              </Routes>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <ToastContainer />
    </Router>
  );
}
