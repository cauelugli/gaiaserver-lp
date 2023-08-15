import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";

import { Box, Button, Grid, Paper } from "@mui/material";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import SideBar from "./components/SideBar";
import CustomerBar from "./components/CustomerBar";
import QuickNotes from "./components/QuickNotes";

import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Jobs from "./pages/Jobs";
import Customers from "./pages/Customers";
import Departments from "./pages/Departments";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function App() {
  const [sidebarStatus, setSidebarStatus] = React.useState(false);
  const [customertabStatus, setCustomertabStatus] = React.useState(true);

  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/customers");
        setCustomers(response.data);
        selectedCustomer === "" && setSelectedCustomer(response.data[0])
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

  const handleCustomerTabStatusChange = () => {
    !customertabStatus
      ? setCustomertabStatus(Boolean(true))
      : setCustomertabStatus(Boolean(false));
  };

  return (
    <Router>
      <Grid container sx={{ backgroundColor: "#ccc", height: "100vw", m:-1 }}>
        <Grid
          item
          xs={sidebarStatus ? 1.5 : 0.6}
          xl={sidebarStatus ? 1.2 : 0.4}
          sx={{ textAlign: "center" }}
        >
          <Box>
            <Button onClick={handleSidebarStatusChange} sx={{ color: "black" }}>
              {sidebarStatus ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </Button>
            <SideBar sidebarOpen={sidebarStatus} />
          </Box>
        </Grid>

        <Grid item xs={sidebarStatus ? (customertabStatus ? 9 : 9.5) : (customertabStatus ? 9.9 : 10.4)} xl={sidebarStatus ? 9.3 : 10.1}>
          <Paper
            sx={{
              p: 3,
              height: "95%",
              backgroundColor: "#93c3c7",
              borderRadius: "00px 10px 10px 00px",
            }}
          >
            <Grid container spacing={1}>
              <Grid item xs={customertabStatus ? 10 : 11  }>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route
                    path="/users"
                    element={
                      <Users
                        selectedCustomer={selectedCustomer}
                        customers={customers}
                      />
                    }
                  />
                  <Route path="/customers" element={<Customers />} />
                  <Route
                    path="/departments"
                    element={
                      <Departments selectedCustomer={selectedCustomer} />
                    }
                  />
                  <Route
                    path="/jobs"
                    element={
                      <Jobs selectedCustomer={selectedCustomer} />
                    }
                  />
                </Routes>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid
          container
          direction="column"
          alignItems="center"
          xs={customertabStatus ? 1.5 : 1}
          xl={1.5}
          sx={{backgroundColor: customertabStatus ? "none" : "#93c3c7"}}
        >
          <Button
            onClick={handleCustomerTabStatusChange}
            sx={{ color: "black" }}
          >
            {customertabStatus ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </Button>
          {customertabStatus && (
            <>
              <CustomerBar
                customers={customers}
                selectedCustomer={selectedCustomer}
                setSelectedCustomer={setSelectedCustomer}
              />
              <QuickNotes quickNotes={""} />
            </>
          )}
        </Grid>
      </Grid>
    </Router>
  );
}
