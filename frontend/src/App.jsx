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
import Requests from "./pages/Requests";
import Customers from "./pages/Customers";
import Departments from "./pages/Departments";
import Services from "./pages/Services";
import Stock from "./pages/Stock";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function App() {
  const [sidebarStatus, setSidebarStatus] = React.useState(false);
  const [customertabStatus, setCustomertabStatus] = React.useState(true);

  const [customers, setCustomers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [services, setServices] = useState([]);
  const [jobs, setJobs] = useState([]);

  const [selectedCustomer, setSelectedCustomer] = useState("");

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const customers = await api.get("/customers");
        const departments = await api.get("/departments");
        const services = await api.get("/services");
        setCustomers(customers.data);
        setDepartments(departments.data);
        setServices(services.data);
        selectedCustomer === "" && setSelectedCustomer(customers.data[0]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [selectedCustomer, customers]);

  const fetchDataRequests = async () => {
    try {
      const jobs = await api.get("/jobs");
      setJobs(jobs.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

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
      <Grid container sx={{ backgroundColor: "#ccc", height: "100vw", m: -1 }}>
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

        <Grid
          item
          xs={
            sidebarStatus
              ? customertabStatus
                ? 9
                : 9.5
              : customertabStatus
              ? 9.9
              : 10.4
          }
          xl={sidebarStatus ? 9.3 : 10.1}
        >
          <Paper
            sx={{
              p: 3,
              height: "95%",
              backgroundColor: "#93c3c7",
              borderRadius: "00px 10px 10px 00px",
            }}
          >
            <Grid container spacing={1}>
              <Grid item xs={customertabStatus ? 10 : 11}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/departments" element={<Departments />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/stock" element={<Stock />} />
                  <Route
                    path="/requests"
                    element={
                      // quem tem que fazer o fetch eh a tabela!
                      <Requests
                        selectedCustomer={selectedCustomer}
                        customers={customers}
                        departments={departments}
                        services={services}
                        jobs={jobs}
                        fetchData={fetchDataRequests}
                      />
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
          sx={{ backgroundColor: customertabStatus ? "none" : "#93c3c7" }}
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
