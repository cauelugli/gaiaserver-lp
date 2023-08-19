/* eslint-disable react/prop-types */
import * as React from "react";
import axios from "axios";

import {
  Box,
  Button,
  Dialog,
  Grid,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import Person4Icon from "@mui/icons-material/Person4";

import UserTable from "../tables/UserTable";
import ManagerTable from "../tables/ManagerTable";
import AdminTable from "../tables/AdminTable";

import AddUserForm from "../forms/add/AddUserForm";
import AddManagerForm from "../forms/add/AddManagerForm";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

function CustomTabPanel(props) {
  const { children, value, index } = props;

  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && (
        <Box sx={{ p: 1 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function Users({ selectedCustomer }) {
  const [value, setValue] = React.useState(0);

  const [users, setUsers] = React.useState([]);
  const [departments, setDepartments] = React.useState([]);

  const [openAddUser, setOpenAddUser] = React.useState(false);
  const [openAddManager, setOpenAddManager] = React.useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const openAddButton = Boolean(anchorEl);
  const handleClickAddButton = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseAddButton = () => {
    setAnchorEl(null);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/users");
        const responseDepartments = await api.get("/departments");
        const filteredUsers = response.data.filter(
          (user) => user.customerId === selectedCustomer._id
        );
        const filteredWorkers = filteredUsers.filter(
          (user) => user.position === "Comum"
        );
        const filteredDepartments = responseDepartments.data
          .filter(
            (department) => department.customerId === selectedCustomer._id
          )
          .map((department) => ({
            id: department._id,
            name: department.name,
            color: department.color,
          }));
        setUsers(filteredWorkers);
        setDepartments(filteredDepartments);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [selectedCustomer._id, users]);

  const fetchData = async () => {
    try {
      const response = await api.get("/users");
      const responseDepartments = await api.get("/departments");
      const filteredUsers = response.data.filter(
        (user) => user.customerId === selectedCustomer._id
      );
      const filteredDepartments = responseDepartments.data
        .filter((department) => department.customerId === selectedCustomer._id)
        .map((department) => ({
          id: department._id,
          name: department.name,
          color: department.color,
        }));
      setUsers(filteredUsers);
      setDepartments(filteredDepartments);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Box sx={{ minWidth: "120%" }}>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <Typography variant="h4" sx={{ mr: 2 }}>
          Colaboradores
        </Typography>
        <div>
          <Button
            id="basic-button"
            aria-controls={openAddButton ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openAddButton ? "true" : undefined}
            onClick={handleClickAddButton}
            variant="outlined"
            sx={{
              borderColor: "#eee",
              borderRadius: 3,
              mb: 1,
              "&:hover": { borderColor: "#eee" },
            }}
          >
            <Typography variant="h6" color="#eee">
              + Novo
            </Typography>
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={openAddButton}
            onClick={handleCloseAddButton}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuList sx={{ width: 170 }}>
              <MenuItem onClick={() => setOpenAddUser(true)}>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText>Colaborador</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => setOpenAddManager(true)}>
                <ListItemIcon>
                  <Person4Icon />
                </ListItemIcon>
                <ListItemText>Gerente</ListItemText>
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Grid>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          TabIndicatorProps={{ style: { backgroundColor: "black" } }}
        >
          <Tab
            label="Funcionários"
            sx={{ color: "#eee", "&.Mui-selected": { color: "black" } }}
          />
          <Tab
            label="Gerência"
            sx={{ color: "#eee", "&.Mui-selected": { color: "black" } }}
          />
          <Tab
            label="Diretoria"
            sx={{ color: "#eee", "&.Mui-selected": { color: "black" } }}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <UserTable selectedCustomer={selectedCustomer} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <ManagerTable selectedCustomer={selectedCustomer} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <AdminTable selectedCustomer={selectedCustomer} />
      </CustomTabPanel>
      {openAddUser && (
        <Dialog
          fullWidth
          maxWidth="md"
          open={openAddUser}
          onClose={() => setOpenAddUser(!openAddUser)}
        >
          <AddUserForm
            openAdd={openAddUser}
            selectedCustomer={selectedCustomer}
            departments={departments}
            setOpenAdd={setOpenAddUser}
            fetchData={fetchData}
          />
        </Dialog>
      )}
      {openAddManager && (
        <Dialog
          fullWidth
          maxWidth="md"
          open={openAddManager}
          onClose={() => setOpenAddManager(!openAddManager)}
        >
          <AddManagerForm
            openAdd={openAddManager}
            selectedCustomer={selectedCustomer}
            setOpenAdd={setOpenAddManager}
            fetchData={fetchData}
          />
        </Dialog>
      )}
    </Box>
  );
}
