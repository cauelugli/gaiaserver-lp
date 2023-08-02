import * as React from "react";

// import axios from "axios";

import { Grid, Box, Button } from "@mui/material";

// const api = axios.create({
//   baseURL: "http://localhost:3000/api",
// });

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import SideBar from "../components/SideBar";
import CustomerTab from "../components/CustomerTab";
import MagicBox from "../components/MagicBox";
import QuickNotes from "../components/QuickNotes";

export default function Home() {
  // const [quickNotes, setQuickNotes] = React.useState([]);
  const [selectedCustomer, setSelectedCustomer] = React.useState("");
  const [sidebarStatus, setSidebarStatus] = React.useState(false);

  // const handleSelectCustomer = (event) => {
  //   setSelectedCustomer(event.target.value);
  // };

  const handleSidebarStatusChange = () => {
    !sidebarStatus
      ? setSidebarStatus(Boolean(true))
      : setSidebarStatus(Boolean(false));
  };

  React.useEffect(() => {
    // const getCustomers = async () => {
    //   const { data } = await api.get("/customers");
    //   const customerProvList = data.map((item) => ({
    //     name: item.name,
    //     address: item.address,
    //     phone: item.phone,
    //     segment: item.segment,
    //     domain: item.domain,
    //     website: item.website,
    //     mainContactName: item.mainContactName,
    //     mainContactEmail: item.mainContactEmail,
    //     mainContactPosition: item.mainContactPosition,
    //     employees: item.employees,
    //     cnpj: item.cnpj,
    //     isActive: item.isActive,
    //     createdAt: item.createdAt,
    //     _id: item._id,
    //   }));
    //   setCustomers(customerProvList);
    // };
    // getCustomers();
    // const getUsers = async () => {
    //   const { data } = await api.get("/users");
    //   const usersProvList = data.map((item) => ({
    //     customerId: item.customerId,
    //     name: item.name,
    //     email: item.email,
    //     phone: item.phone,
    //     position: item.position,
    //     department: item.department,
    //     manager: item.manager,
    //     avatar: item.avatar,
    //     avatarColor: item.avatarColor,
    //     isActive: item.isActive,
    //     createdAt: item.createdAt,
    //     _id: item._id,
    //   }));
    //   setUsers(usersProvList);
    // };
    // getUsers();
    // const getJobs = async () => {
    //   const { data } = await api.get("/jobs");
    //   const jobsProvList = data.map((item) => ({
    //     customerId: item.customerId,
    //     requesterUserId: item.requesterUserId,
    //     workerUserId: item.workerUserId,
    //     type: item.type,
    //     title: item.title,
    //     description: item.description,
    //     status: item.status,
    //     price: item.price,
    //     cost: item.cost,
    //     profit: item.profit,
    //     scheduledDate: item.scheduledDate,
    //     updatedAt: item.updatedAt,
    //     updatedBy: item.updatedBy,
    //     createdAt: item.createdAt,
    //     _id: item._id,
    //   }));
    //   setJobs(jobsProvList);
    // };
    // getJobs();
    // const getDepartments = async () => {
    //   const { data } = await api.get("/departments");
    //   const departmentsProvList = data.map((item) => ({
    //     customerId: item.customerId,
    //     name: item.name,
    //     phone: item.phone,
    //     email: item.email,
    //     manager: item.manager,
    //     members: item.members,
    //     isActive: item.isActive,
    //     createdAt: item.createdAt,
    //     _id: item._id,
    //   }));
    //   setDepartments(departmentsProvList);
    // };
    // getDepartments();
    // const getManagers = async () => {
    //   const { data } = await api.get("/managers");
    //   const managersProvList = data.map((item) => ({
    //     customerId: item.customerId,
    //     name: item.name,
    //     phone: item.phone,
    //     email: item.email,
    //     avatar: item.avatar,
    //     avatarColor: item.avatarColor,
    //     isActive: item.isActive,
    //     createdAt: item.createdAt,
    //     _id: item._id,
    //   }));
    //   setManagers(managersProvList);
    // };
    // getManagers();
    // const getQuickNotes = async () => {
    //   const { data } = await api.get("/quicknotes");
    //   const qnProvList = data.map((item) => ({
    //     body: item.body,
    //     isActive: item.isActive,
    //     createdAt: item.createdAt,
    //     _id: item._id,
    //   }));
    //   setQuickNotes(qnProvList);
    // };
    // getQuickNotes();
  }, []);

  return (
    <Box>

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
          <MagicBox />
        </Grid>

        <Grid
          container
          direction="column"
          alignItems="center"
          xs={1.5}
          xl={1.5}
        >
          <CustomerTab />
          <QuickNotes quickNotes={""} />
        </Grid>

      </Grid>
    </Box>
  );
}
