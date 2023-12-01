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
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

import UserTable from "../tables/UserTable";
import ManagerTable from "../tables/ManagerTable";
import OperatorTable from "../tables/OperatorTable";
import RoleTable from "../tables/RoleTable";

import AddUserForm from "../forms/add/AddUserForm";
import AddManagerForm from "../forms/add/AddManagerForm";
import AddOperatorForm from "../forms/add/AddOperatorForm";
import AddRoleForm from "../forms/add/AddRoleForm";

import TableFilters from "../components/TableFilters";
import NoDataText from "../components/small/NoDataText";
import RefreshButton from "../components/small/buttons/RefreshButton";

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

// eslint-disable-next-line no-unused-vars
export default function Users({ user }) {
  const [refreshData, setRefreshData] = React.useState(false);
  const [value, setValue] = React.useState(0);

  const [users, setUsers] = React.useState([]);
  const [managers, setManagers] = React.useState([]);
  const [operators, setOperators] = React.useState([]);
  const [departments, setDepartments] = React.useState([]);
  const [positions, setPositions] = React.useState([]);
  const [roles, setRoles] = React.useState([]);

  const [openAddUser, setOpenAddUser] = React.useState(false);
  const [openAddManager, setOpenAddManager] = React.useState(false);
  const [openAddOperator, setOpenAddOperator] = React.useState(false);
  const [openAddRole, setOpenAddRole] = React.useState(false);

  const [searchOption, setSearchOption] = React.useState("name");
  const [searchOptionLabel, setSearchOptionLabel] = React.useState("Nome");
  const [searchValue, setSearchValue] = React.useState("");
  const searchOptionList = [
    {
      // USERS TABLE
      options: [
        { value: "name", label: "Nome" },
        { value: "email", label: "E-mail" },
        { value: "phone", label: "Telefone" },
        { value: "department.name", label: "Departamento" },
      ],
    },
    {
      // MANAGERS TABLE
      options: [
        { value: "name", label: "Nome" },
        { value: "email", label: "E-mail" },
        { value: "phone", label: "Telefone" },
        { value: "department.name", label: "Departamento" },
      ],
    },
    {
      // OPERATORS TABLE
      options: [
        { value: "name", label: "Nome" },
        { value: "username", label: "Nome de Operador" },
        { value: "role", label: "Nível de Acesso" },
      ],
    },
    {
      // ROLES TABLE
      options: [{ value: "name", label: "Nome" }],
    },
  ];

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

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
    setSearchValue("");
    setSearchOption("name");
    setSearchOptionLabel("Nome");
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await api.get("/users");
        const managers = await api.get("/managers");
        const departments = await api.get("/departments");
        const positions = await api.get("/positions");
        const roles = await api.get("/roles");
        const usersData = users.data;
        const managersData = managers.data;
        const combinedData = [...usersData, ...managersData];
        setUsers(usersData);
        setManagers(managersData);
        setDepartments(departments.data);
        setOperators(combinedData);
        setDepartments(departments.data);
        setPositions(positions.data);
        setRoles(roles.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [refreshData]);

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
            <MenuList sx={{ width: 190 }}>
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
                  <ManageAccountsIcon />
                </ListItemIcon>
                <ListItemText>Operador</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => setOpenAddRole(true)}>
                <ListItemIcon>
                  <AdminPanelSettingsIcon />
                </ListItemIcon>
                <ListItemText>Perfil de Acesso</ListItemText>
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
            label={<Typography sx={{ fontSize: 13 }}>Funcionários</Typography>}
            sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
          />
          <Tab
            label={<Typography sx={{ fontSize: 13 }}>Gerentes</Typography>}
            sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
          />
          <Tab
            label={<Typography sx={{ fontSize: 13 }}>Operadores</Typography>}
            sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
          />
          <Tab
            label={
              <Typography sx={{ fontSize: 13 }}>Perfil de Acesso</Typography>
            }
            sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
          />
          <RefreshButton
            refreshData={refreshData}
            setRefreshData={setRefreshData}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {users.length === 0 ? (
          <NoDataText option="Funcionários" />
        ) : (
          <>
            <TableFilters
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              searchOption={searchOption}
              searchOptionList={searchOptionList[0]}
              setSearchOption={setSearchOption}
              searchOptionLabel={searchOptionLabel}
              setSearchOptionLabel={setSearchOptionLabel}
              handleSearchChange={handleSearchChange}
            />

            <UserTable
              refreshData={refreshData}
              setRefreshData={setRefreshData}
              searchValue={searchValue}
              // searchDepartment={searchDepartment}
              searchOption={searchOption}
            />
          </>
        )}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {managers.length === 0 ? (
          <NoDataText option="Gerentes" />
        ) : (
          <>
            <TableFilters
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              searchOption={searchOption}
              searchOptionList={searchOptionList[1]}
              setSearchOption={setSearchOption}
              searchOptionLabel={searchOptionLabel}
              setSearchOptionLabel={setSearchOptionLabel}
              handleSearchChange={handleSearchChange}
            />

            <ManagerTable
              refreshData={refreshData}
              setRefreshData={setRefreshData}
              searchValue={searchValue}
              searchOption={searchOption}
            />
          </>
        )}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        {users.length === 0 ? (
          <NoDataText option="Operadores" />
        ) : (
          <>
            <TableFilters
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              searchOption={searchOption}
              searchOptionList={searchOptionList[2]}
              setSearchOption={setSearchOption}
              searchOptionLabel={searchOptionLabel}
              setSearchOptionLabel={setSearchOptionLabel}
              handleSearchChange={handleSearchChange}
            />

            <OperatorTable
              refreshData={refreshData}
              setRefreshData={setRefreshData}
              searchValue={searchValue}
              searchOption={searchOption}
            />
          </>
        )}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        {roles.length === 0 ? (
          <NoDataText option="Perfil de Acesso" />
        ) : (
          <>
            <TableFilters
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              searchOption={searchOption}
              searchOptionList={searchOptionList[3]}
              setSearchOption={setSearchOption}
              searchOptionLabel={searchOptionLabel}
              setSearchOptionLabel={setSearchOptionLabel}
              handleSearchChange={handleSearchChange}
            />

            <RoleTable
              refreshData={refreshData}
              setRefreshData={setRefreshData}
              searchValue={searchValue}
              searchOption={searchOption}
            />
          </>
        )}
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
            positions={positions}
            setOpenAdd={setOpenAddUser}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
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
            refreshData={refreshData}
            setRefreshData={setRefreshData}
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
            operators={operators.filter((op) => !op.username)}
            roles={roles}
            openAdd={openAddOperator}
            setOpenAdd={setOpenAddOperator}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            toast={toast}
          />
        </Dialog>
      )}
      {openAddRole && (
        <Dialog
          fullWidth
          maxWidth="xs"
          open={openAddRole}
          onClose={() => setOpenAddRole(!openAddRole)}
        >
          <AddRoleForm
            openAdd={openAddRole}
            setOpenAdd={setOpenAddRole}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            toast={toast}
          />
        </Dialog>
      )}
    </Box>
  );
}