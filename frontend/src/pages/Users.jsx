/* eslint-disable react/prop-types */
import * as React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import OperatorTable from "../tables/OperatorTable";

import AddUserForm from "../forms/add/AddUserForm";
import AddManagerForm from "../forms/add/AddManagerForm";
import AddOperatorForm from "../forms/add/AddOperatorForm";

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

export default function Users() {
  const [value, setValue] = React.useState(0);

  const [users, setUsers] = React.useState([]);
  const [departments, setDepartments] = React.useState([]);
  const [operators, setOperators] = React.useState([]);

  const [openAddUser, setOpenAddUser] = React.useState(false);
  const [openAddManager, setOpenAddManager] = React.useState(false);
  const [openAddOperator, setOpenAddOperator] = React.useState(false);

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
        const users = await api.get("/users");
        const managers = await api.get("/managers");
        const departments = await api.get("/departments");
        const usersData = users.data;
        const managersData = managers.data;
        const combinedData = [...usersData, ...managersData];
        setUsers(usersData);
        setDepartments(departments.data);
        setOperators(combinedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [users]);

  const fetchData = async () => {
    try {
      const users = await api.get("/users");
      const managers = await api.get("/managers");
      const departments = await api.get("/departments");
      const usersData = users.data;
      const managersData = managers.data;
      const combinedData = [...usersData, ...managersData];
      setUsers(usersData);
      setDepartments(departments.data);
      setOperators(combinedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Box>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <Typography
          sx={{ fontSize: 23, mt: 0.5, ml: 1, mr: 2, fontWeight: "bold" }}
        >
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
            size="small"
            sx={{
              borderRadius: 3,
              bottom: 3,
              "&:hover": { borderColor: "#eee" },
            }}
          >
            <Typography variant="h6">+</Typography>
            <Typography sx={{ fontSize: 16, mt: 0.5, ml: 0.5 }}>
              Novo
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
              <MenuItem onClick={() => setOpenAddOperator(true)}>
                <ListItemIcon>
                  <Person4Icon />
                </ListItemIcon>
                <ListItemText>Operador</ListItemText>
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
            label={<Typography sx={{ fontSize: 14 }}>Funcionários</Typography>}
            sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
          />
          <Tab
            label={<Typography sx={{ fontSize: 14 }}>Gerentes</Typography>}
            sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
          />
          <Tab
            label={<Typography sx={{ fontSize: 14 }}>Operadores</Typography>}
            sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <UserTable />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <ManagerTable />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <OperatorTable />
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
            departments={departments}
            setOpenAdd={setOpenAddUser}
            fetchData={fetchData}
            toast={toast}
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
            departments={departments}
            setOpenAdd={setOpenAddManager}
            fetchData={fetchData}
            toast={toast}
          />
        </Dialog>
      )}
      {openAddOperator && (
        <Dialog
          fullWidth
          maxWidth="sm"
          open={openAddOperator}
          onClose={() => setOpenAddOperator(!openAddOperator)}
        >
          <AddOperatorForm
            openAdd={openAddOperator}
            operators={operators.filter((op) => !op.username)}
            setOpenAdd={setOpenAddOperator}
            fetchData={fetchData}
            toast={toast}
          />
        </Dialog>
      )}
    </Box>
  );
}
