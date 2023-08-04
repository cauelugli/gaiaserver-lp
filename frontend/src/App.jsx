import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Box, Button, Grid, Paper } from "@mui/material";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import SideBar from "./components/SideBar";
import CustomerBar from "./components/CustomerBar";
import QuickNotes from "./components/QuickNotes";

import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Customers from "./pages/Customers";
import Departments from "./pages/Departments";

export default function App() {
  const [sidebarStatus, setSidebarStatus] = React.useState(false);

  // const handleSelectCustomer = (event) => {
  //   setSelectedCustomer(event.target.value);
  // };

  const handleSidebarStatusChange = () => {
    !sidebarStatus
      ? setSidebarStatus(Boolean(true))
      : setSidebarStatus(Boolean(false));
  };

  return (
    <Router>
      <Grid container sx={{ backgroundColor: "#ccc", height: "100vw" }}>
        <Grid
          item
          xs={sidebarStatus ? 1.5 : 0.6}
          xl={sidebarStatus ? 1.2 : 0.4}
          sx={{ textAlign: "center" }}
        >
          <Box sx={{ backgroundColor: "#ccc" }}>
            <Button onClick={handleSidebarStatusChange} sx={{ color: "black" }}>
              {sidebarStatus ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </Button>
            <SideBar sidebarOpen={sidebarStatus} />
          </Box>
        </Grid>

        <Grid
          item
          xs={sidebarStatus ? 9 : 9.9}
          // xl={sidebarStatus ? 10.2 : 10.4}
        >
          <Paper
            sx={{
              p: 3,
              height: "95%",
              backgroundColor: "#0c4",
              borderRadius: "00px 10px 10px 00px",
            }}
          >
            <Grid container spacing={1}>
              <Grid item xs={10}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/departments" element={<Departments />} />
                </Routes>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid
          container
          direction="column"
          alignItems="center"
          xs={1.5}
          xl={1.5}
        >
          <CustomerBar />
          <QuickNotes quickNotes={""} />
        </Grid>
      </Grid>
    </Router>
  );
}
