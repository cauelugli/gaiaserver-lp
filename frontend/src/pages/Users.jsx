/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import * as React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import {
  Box,
  Button,
  Dialog,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputAdornment,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import Person4Icon from "@mui/icons-material/Person4";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

import UserTable from "../tables/UserTable";
import ManagerTable from "../tables/ManagerTable";
import OperatorTable from "../tables/OperatorTable";
import RoleTable from "../tables/RoleTable";

import AddUserForm from "../forms/add/AddUserForm";
import AddManagerForm from "../forms/add/AddManagerForm";
import AddOperatorForm from "../forms/add/AddOperatorForm";
import AddRoleForm from "../forms/add/AddRoleForm";
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

  const [searchValue, setSearchValue] = React.useState("");
  const [searchValueDeptColor, setSearchValueDeptColor] = React.useState("");
  const [searchOption, setSearchOption] = React.useState("name");

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSearchOptionChange = (event) => {
    setSearchOption(event.target.value);
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
          <Tab
            label={
              <Typography sx={{ fontSize: 14 }}>Perfil de Acesso</Typography>
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
            <Grid container direction="row" justifyContent="flex-start">
              <Grid item>
                <TextField
                  placeholder="Pesquise aqui..."
                  size="small"
                  sx={{ mb: 1, ml: "2%", width: 350 }}
                  value={searchValue}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    endAdornment:
                      searchValue.length > 0 ? (
                        <InputAdornment position="end">
                          <ClearIcon
                            cursor="pointer"
                            sx={{ color: "#d21404" }}
                            onClick={() => setSearchValue("")}
                          />
                        </InputAdornment>
                      ) : (
                        ""
                      ),
                  }}
                />
              </Grid>
              <Grid item sx={{ ml: "2%", pt: 0.5 }}>
                <RadioGroup
                  row
                  value={searchOption}
                  onChange={handleSearchOptionChange}
                >
                  <FormControlLabel
                    value="name"
                    control={
                      <Radio
                        sx={{
                          "& .MuiSvgIcon-root": {
                            fontSize: 13,
                          },
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: 13, mx: -1, mt: 0.5 }}>
                        Nome
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    value="email"
                    control={
                      <Radio
                        sx={{
                          "& .MuiSvgIcon-root": {
                            fontSize: 13,
                          },
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: 13, mx: -1, mt: 0.5 }}>
                        E-mail
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    value="phone"
                    control={
                      <Radio
                        sx={{
                          "& .MuiSvgIcon-root": {
                            fontSize: 13,
                          },
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: 13, mx: -1, mt: 0.5 }}>
                        Telefone
                      </Typography>
                    }
                  />

                  {departments.length > 0 && (
                    <FormControlLabel
                      value="department.name"
                      control={
                        <Radio
                          sx={{
                            "& .MuiSvgIcon-root": {
                              fontSize: 13,
                            },
                          }}
                        />
                      }
                      label={
                        <Typography sx={{ fontSize: 13, mx: -1, mt: 0.5 }}>
                          Departamento
                        </Typography>
                      }
                    />
                  )}
                </RadioGroup>
              </Grid>
              <Grid item sx={{ ml: "1%" }}>
                {searchOption === "department.name" && (
                  <>
                    <Select
                      onChange={(e) => {
                        setSearchValue(e.target.value.name),
                          setSearchValueDeptColor(e.target.value.color);
                      }}
                      value={searchValue}
                      renderValue={(selected) => (
                        <Grid container direction="row">
                          <Paper
                            elevation={0}
                            sx={{
                              mr: 1,
                              mt: 0.5,
                              width: 12,
                              height: 12,
                              borderRadius: 50,
                              backgroundColor: searchValueDeptColor,
                            }}
                          />
                          <Typography>{searchValue}</Typography>
                        </Grid>
                      )}
                      size="small"
                      sx={{ minWidth: 200 }}
                    >
                      {departments.map((item) => (
                        <MenuItem value={item} key={item.id}>
                          <Grid container direction="row">
                            <Paper
                              elevation={0}
                              sx={{
                                mr: 1,
                                mt: 0.5,
                                width: 12,
                                height: 12,
                                borderRadius: 50,
                                backgroundColor: item.color,
                              }}
                            />
                            <Typography>{item.name}</Typography>
                          </Grid>
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>Selecione o Departamento</FormHelperText>
                  </>
                )}
              </Grid>
            </Grid>

            <UserTable
              refreshData={refreshData}
              setRefreshData={setRefreshData}
              searchValue={searchValue}
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
            <Grid container direction="row" justifyContent="flex-start">
              <Grid item>
                <TextField
                  placeholder="Pesquise aqui..."
                  size="small"
                  sx={{ mb: 1, ml: "2%", width: 350 }}
                  value={searchValue}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    endAdornment:
                      searchValue.length > 0 ? (
                        <InputAdornment position="end">
                          <ClearIcon
                            cursor="pointer"
                            sx={{ color: "#d21404" }}
                            onClick={() => setSearchValue("")}
                          />
                        </InputAdornment>
                      ) : (
                        ""
                      ),
                  }}
                />
              </Grid>
              <Grid item sx={{ ml: "2%", pt: 0.5 }}>
                <RadioGroup
                  row
                  value={searchOption}
                  onChange={handleSearchOptionChange}
                >
                  <FormControlLabel
                    value="name"
                    control={
                      <Radio
                        sx={{
                          "& .MuiSvgIcon-root": {
                            fontSize: 13,
                          },
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: 13, mx: -1, mt: 0.5 }}>
                        Nome
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    value="email"
                    control={
                      <Radio
                        sx={{
                          "& .MuiSvgIcon-root": {
                            fontSize: 13,
                          },
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: 13, mx: -1, mt: 0.5 }}>
                        E-mail
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    value="phone"
                    control={
                      <Radio
                        sx={{
                          "& .MuiSvgIcon-root": {
                            fontSize: 13,
                          },
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: 13, mx: -1, mt: 0.5 }}>
                        Telefone
                      </Typography>
                    }
                  />
                </RadioGroup>
              </Grid>
            </Grid>

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
            <Grid container direction="row" justifyContent="flex-start">
              <Grid item>
                <TextField
                  placeholder="Pesquise aqui..."
                  size="small"
                  sx={{ mb: 1, ml: "2%", width: 350 }}
                  value={searchValue}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    endAdornment:
                      searchValue.length > 0 ? (
                        <InputAdornment position="end">
                          <ClearIcon
                            cursor="pointer"
                            sx={{ color: "#d21404" }}
                            onClick={() => setSearchValue("")}
                          />
                        </InputAdornment>
                      ) : (
                        ""
                      ),
                  }}
                />
              </Grid>
              <Grid item sx={{ ml: "2%", pt: 0.5 }}>
                <RadioGroup
                  row
                  value={searchOption}
                  onChange={handleSearchOptionChange}
                >
                  <FormControlLabel
                    value="name"
                    control={
                      <Radio
                        sx={{
                          "& .MuiSvgIcon-root": {
                            fontSize: 13,
                          },
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: 13, mx: -1, mt: 0.5 }}>
                        Nome
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    value="username"
                    control={
                      <Radio
                        sx={{
                          "& .MuiSvgIcon-root": {
                            fontSize: 13,
                          },
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: 13, mx: -1, mt: 0.5 }}>
                        Nome de Operador
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    value="role"
                    control={
                      <Radio
                        sx={{
                          "& .MuiSvgIcon-root": {
                            fontSize: 13,
                          },
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: 13, mx: -1, mt: 0.5 }}>
                        Perfil de Acesso
                      </Typography>
                    }
                  />
                </RadioGroup>
              </Grid>
              <Grid item sx={{ ml: "1%" }}>
                {searchOption === "role" && (
                  <>
                    <Select
                      onChange={(e) => setSearchValue(e.target.value)}
                      value={searchValue}
                      renderValue={(selected) => (
                        <Typography>{selected}</Typography>
                      )}
                      size="small"
                      sx={{ minWidth: 200 }}
                    >
                      {/* {roles.map((item) => (
                    <MenuItem value={item} key={item.id}>
                      <Typography>{item.name}</Typography>
                    </MenuItem>
                  ))} */}
                      <MenuItem value="placeholder">
                        <Typography>placeholder</Typography>
                      </MenuItem>
                    </Select>
                    <FormHelperText>Selecione o Perfil</FormHelperText>
                  </>
                )}
              </Grid>
            </Grid>

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
            <Grid container direction="row" justifyContent="flex-start">
              <Grid item>
                <TextField
                  placeholder="Pesquise aqui..."
                  size="small"
                  sx={{ mb: 1, ml: "2%", width: 350 }}
                  value={searchValue}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    endAdornment:
                      searchValue.length > 0 ? (
                        <InputAdornment position="end">
                          <ClearIcon
                            cursor="pointer"
                            sx={{ color: "#d21404" }}
                            onClick={() => setSearchValue("")}
                          />
                        </InputAdornment>
                      ) : (
                        ""
                      ),
                  }}
                />
              </Grid>
              <Grid item sx={{ ml: "2%", pt: 0.5 }}>
                <RadioGroup
                  row
                  value={searchOption}
                  onChange={handleSearchOptionChange}
                >
                  <FormControlLabel
                    value="name"
                    control={
                      <Radio
                        sx={{
                          "& .MuiSvgIcon-root": {
                            fontSize: 13,
                          },
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: 13, mx: -1, mt: 0.5 }}>
                        Nome do Perfil
                      </Typography>
                    }
                  />
                </RadioGroup>
              </Grid>
            </Grid>

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
