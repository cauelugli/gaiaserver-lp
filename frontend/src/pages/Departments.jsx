/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import { toast } from "react-toastify";

import {
  Box,
  CircularProgress,
  Dialog,
  Grid,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

import DepartmentTable from "../tables/DepartmentTable";
import AddDepartmentForm from "../forms/add/AddDepartmentForm";

import TableFilters from "../components/TableFilters";
import RefreshButton from "../components/small/buttons/RefreshButton";
import NoDataText from "../components/small/NoDataText";
import DepartmentTableButton from "../components/small/buttons/tableButtons/DepartmentTableButton";
import GroupTable from "../tables/GroupTable";
import AddGroupForm from "../forms/add/AddGroupForm";

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
  const [isLoading, setIsLoading] = React.useState(true);

  const [refreshData, setRefreshData] = React.useState(false);
  const [config, setConfig] = React.useState(false);
  const [configCustomization, setConfigCustomization] = React.useState(false);
  const [value, setValue] = React.useState(0);

  const [openAddDepartment, setOpenAddDepartment] = React.useState(false);
  const [openAddGroup, setOpenAddGroup] = React.useState(false);

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
      // GROUP TABLE
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
  const [groups, setGroups] = React.useState([]);
  const [allUsers, setAllUsers] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await api.get("/users");
        const managers = await api.get("/managers");
        const departments = await api.get("/departments");
        const positions = await api.get("/positions");
        const groups = await api.get("/groups");
        const config = await api.get("/config/departments");
        const configCustomization = await api.get("/config");
        const allUsersData = [...users.data, ...managers.data];

        setConfig(config.data);
        setConfigCustomization(configCustomization.data[0].customization);
        setUsers(users.data);
        setManagers(managers.data);
        setGroups(groups.data);
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
        setAllUsers(allUsersData);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
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

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        sx={{ m: 2 }}
      >
        <Typography sx={{ fontSize: 25, mr: 1, fontWeight: "bold" }}>
          Departamentos
        </Typography>
        <DepartmentTableButton
          anchorEl={anchorEl}
          openAddButton={openAddButton}
          handleClickAddButton={handleClickAddButton}
          handleCloseAddButton={handleCloseAddButton}
          setOpenAddDepartment={setOpenAddDepartment}
          setOpenAddGroup={setOpenAddGroup}
          configCustomization={configCustomization}
        />
      </Grid>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          TabIndicatorProps={{ style: { backgroundColor: "black" } }}
        >
          <Tab
            label={<Typography sx={{ fontSize: 13 }}>Serviços</Typography>}
            sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
          />
          <Tab
            label={<Typography sx={{ fontSize: 13 }}>Vendas</Typography>}
            sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
          />
          {configTables.departmentInternal && (
            <Tab
              label={<Typography sx={{ fontSize: 13 }}>Internos</Typography>}
              sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
            />
          )}
          <Tab
            label={<Typography sx={{ fontSize: 13 }}>Grupos</Typography>}
            sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
          />
          <RefreshButton
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            configCustomization={configCustomization}
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
        index={configTables.departmentInternal ? 4 : 3}
      >
        {groups.length === 0 ? (
          <NoDataText option="Grupos" />
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

            <GroupTable
              configData={config}
              toast={toast}
              searchValue={searchValue}
              searchOption={searchOption}
              positions={positions}
              users={users}
              allUsers={allUsers}
              groups={groups}
              managers={managers}
              openAdd={openAddGroup}
              setOpenAdd={setOpenAddGroup}
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
            configCustomization={configCustomization}
            toast={toast}
          />
        </Dialog>
      )}
      {openAddGroup && (
        <Dialog
          fullWidth
          maxWidth="xs"
          open={openAddGroup}
          onClose={() => setOpenAddGroup(!openAddGroup)}
        >
          <AddGroupForm
            user={user}
            users={allUsers}
            openAdd={openAddGroup}
            setOpenAdd={setOpenAddGroup}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            configCustomization={configCustomization}
            toast={toast}
          />
        </Dialog>
      )}
    </Box>
  );
}
