/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import { toast } from "react-toastify";

import {
  Box,
  Button,
  Dialog,
  Grid,
  InputAdornment,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import LanIcon from "@mui/icons-material/Lan";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";

import DepartmentTable from "../tables/DepartmentTable";
import PositionTable from "../tables/PositionTable";

import AddPositionForm from "../forms/add/AddPositionForm";
import AddDepartmentForm from "../forms/add/AddDepartmentForm";

import TableFilters from "../components/TableFilters";
import RefreshButton from "../components/small/buttons/RefreshButton";
import NoDataText from "../components/small/NoDataText";

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

export default function Departments({ user, configTables }) {
  const [refreshData, setRefreshData] = React.useState(false);
  const [config, setConfig] = React.useState(false);
  const [value, setValue] = React.useState(0);

  const [openAddDepartment, setOpenAddDepartment] = React.useState(false);
  const [openAddPosition, setOpenAddPosition] = React.useState(false);

  const [searchValue, setSearchValue] = React.useState("");
  const [searchOption, setSearchOption] = React.useState("name");
  const [searchOptionLabel, setSearchOptionLabel] = React.useState("Nome");
  const searchOptionList = [
    {
      // SERVICES DEPARTMENT TABLE
      options: [
        { value: "name", label: "Nome" },
        { value: "email", label: "E-mail" },
        { value: "manager.name", label: "Gerente" },
      ],
    },
    {
      // SALES DEPARTMENT TABLE
      options: [
        { value: "name", label: "Nome" },
        { value: "email", label: "E-mail" },
        { value: "manager.name", label: "Gerente" },
      ],
    },
    {
      // INTERNAL DEPARTMENT TABLE
      options: [
        { value: "name", label: "Nome" },
        { value: "email", label: "E-mail" },
        { value: "manager.name", label: "Gerente" },
      ],
    },
    {
      // POSITIONS TABLE
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

  const [users, setUsers] = React.useState([]);
  const [managers, setManagers] = React.useState([]);
  const [serviceDepartments, setServiceDepartments] = React.useState([]);
  const [saleDepartments, setSaleDepartments] = React.useState([]);
  const [internalDepartments, setInternalDepartments] = React.useState([]);
  const [positions, setPositions] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await api.get("/users");
        const managers = await api.get("/managers");
        const departments = await api.get("/departments");
        const positions = await api.get("/positions");
        const config = await api.get("/config/departments");
        setConfig(config.data);
        setUsers(users.data);
        setManagers(managers.data);
        setServiceDepartments(
          departments.data.filter(
            (department) => department.type === "Serviços"
          )
        );
        setSaleDepartments(
          departments.data.filter((department) => department.type === "Vendas")
        );
        setInternalDepartments(
          departments.data.filter((department) => department.type === "Interno")
        );
        setPositions(positions.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [refreshData]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setSearchValue("");
    setSearchOption("name");
    setSearchOptionLabel("Nome");
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
          Departamentos
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
            <MenuList sx={{ width: 170 }}>
              <MenuItem onClick={() => setOpenAddDepartment(true)}>
                <ListItemIcon>
                  <LanIcon />
                </ListItemIcon>
                <ListItemText>Departamento</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => setOpenAddPosition(true)}>
                <ListItemIcon>
                  <AssignmentIndIcon />
                </ListItemIcon>
                <ListItemText>Cargo</ListItemText>
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
            label="Serviços"
            sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
          />
          <Tab
            label="Vendas"
            sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
          />
          {configTables.departmentInternal && (
            <Tab
              label="Internos"
              sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
            />
          )}
          <Tab
            label="Cargos"
            sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
          />
          <RefreshButton
            refreshData={refreshData}
            setRefreshData={setRefreshData}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {serviceDepartments.length === 0 ? (
          <NoDataText option="Departamentos de Serviços" />
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

            <DepartmentTable
              configData={config}
              users={users}
              managers={managers}
              searchValue={searchValue}
              searchOption={searchOption}
              departments={serviceDepartments}
              openAdd={openAddDepartment}
              setOpenAdd={setOpenAddDepartment}
              refreshData={refreshData}
              setRefreshData={setRefreshData}
              toast={toast}
            />
          </>
        )}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {saleDepartments.length === 0 ? (
          <NoDataText option="Departamentos de Vendas" />
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

            <DepartmentTable
              configData={config}
              toast={toast}
              users={users}
              managers={managers}
              searchValue={searchValue}
              searchOption={searchOption}
              departments={saleDepartments}
              openAdd={openAddDepartment}
              setOpenAdd={setOpenAddDepartment}
              refreshData={refreshData}
              setRefreshData={setRefreshData}
            />
          </>
        )}
      </CustomTabPanel>
      {configTables.departmentInternal && (
        <CustomTabPanel value={value} index={2}>
          {internalDepartments.length === 0 ? (
            <NoDataText option="Departamentos Internos" />
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

              <DepartmentTable
                configData={config}
                toast={toast}
                users={users}
                managers={managers}
                searchValue={searchValue}
                searchOption={searchOption}
                departments={internalDepartments}
                openAdd={openAddDepartment}
                setOpenAdd={setOpenAddDepartment}
                refreshData={refreshData}
                setRefreshData={setRefreshData}
              />
            </>
          )}
        </CustomTabPanel>
      )}
      <CustomTabPanel
        value={value}
        index={configTables.departmentInternal ? 3 : 2}
      >
        {positions.length === 0 ? (
          <NoDataText option="Cargos" />
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

            <PositionTable
              configData={config}
              toast={toast}
              searchValue={searchValue}
              searchOption={searchOption}
              positions={positions}
              users={users}
              openAdd={openAddPosition}
              setOpenAdd={setOpenAddPosition}
              refreshData={refreshData}
              setRefreshData={setRefreshData}
            />
          </>
        )}
      </CustomTabPanel>
      {openAddDepartment && (
        <Dialog
          fullWidth
          maxWidth="md"
          open={openAddDepartment}
          onClose={() => setOpenAddDepartment(!openAddDepartment)}
        >
          <AddDepartmentForm
            configData={config}
            openAdd={openAddDepartment}
            users={users}
            managers={managers}
            setOpenAdd={setOpenAddDepartment}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            toast={toast}
          />
        </Dialog>
      )}
      {openAddPosition && (
        <Dialog
          fullWidth
          maxWidth="xs"
          open={openAddPosition}
          onClose={() => setOpenAddPosition(!openAddPosition)}
        >
          <AddPositionForm
            user={user}
            openAdd={openAddPosition}
            setOpenAdd={setOpenAddPosition}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            toast={toast}
          />
        </Dialog>
      )}
    </Box>
  );
}
