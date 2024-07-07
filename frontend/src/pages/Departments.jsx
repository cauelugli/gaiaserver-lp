/* eslint-disable react/prop-types */
import React from "react";
import { toast } from "react-toastify";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

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

import RefreshButton from "../components/small/buttons/RefreshButton";
import NoDataText from "../components/small/NoDataText";
import DepartmentTableButton from "../components/small/buttons/tableButtons/DepartmentTableButton";
import GroupTable from "../tables/GroupTable";
import AddGroupForm from "../forms/add/AddGroupForm";
import TableOrCardSelector from "../components/small/TableOrCardSelector";
import DepartmentCard from "../components/cards/DepartmentCard";

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

export default function Departments({
  configData,
  userName,
  userId,
  topBar,
  tableOrCardView,
  setUserPreferences,
  configTables,
  cardSize,
}) {
  const [isLoading, setIsLoading] = React.useState(true);

  const [refreshData, setRefreshData] = React.useState(false);
  const [newDataRefreshButton, setNewDataRefreshButton] = React.useState(true);
  const [config, setConfig] = React.useState(false);
  const [configCustomization, setConfigCustomization] = React.useState(false);
  const [value, setValue] = React.useState(0);

  const [openAddDepartment, setOpenAddDepartment] = React.useState(false);
  const [openAddGroup, setOpenAddGroup] = React.useState(false);

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
        const config = await api.get("/config");
        const departments = await api.get("/departments");
        const groups = await api.get("/groups");
        const managers = await api.get("/managers");
        const positions = await api.get("/positions");
        const users = await api.get("/users");
        const allUsersData = [...users.data, ...managers.data];
        setConfig(config.data[0].departments);
        setConfigCustomization(config.data[0].customization);
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
    <Box sx={{ minHeight: "50vw" }}>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        sx={{ ml: 2 }}
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
            userId={userId}
            newDataRefreshButton={newDataRefreshButton}
            setNewDataRefreshButton={setNewDataRefreshButton}
          />
          <Grid sx={{ my: "auto", ml: "auto" }}>
            <TableOrCardSelector
              userId={userId}
              refreshData={refreshData}
              setRefreshData={setRefreshData}
              tableOrCard={tableOrCardView}
              setUserPreferences={setUserPreferences}
              cardSize={cardSize}
            />
          </Grid>
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {serviceDepartments.length === 0 ? (
          <NoDataText option="Departamentos de Serviços" />
        ) : (
          <>
            {tableOrCardView ? (
              <DepartmentTable
                userId={userId}
                configData={config}
                users={users}
                managers={managers}
                departments={serviceDepartments}
                openAdd={openAddDepartment}
                setOpenAdd={setOpenAddDepartment}
                refreshData={refreshData}
                setRefreshData={setRefreshData}
                toast={toast}
                topBar={topBar}
              />
            ) : (
              <Grid
                sx={{ mt: 0.5, width: topBar ? "107%" : "100%" }}
                container
                spacing={2}
              >
                {serviceDepartments.map((department, index) => (
                  <Grid
                    key={index}
                    item
                    md={cardSize}
                    lg={cardSize}
                    xl={cardSize}
                  >
                    <DepartmentCard
                      userId={userId}
                      department={department}
                      configData={configData}
                      refreshData={refreshData}
                      setRefreshData={setRefreshData}
                      users={allUsers.map((user) => ({
                        _id: user._id,
                        image: user.image,
                      }))}
                      managers={managers}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {saleDepartments.length === 0 ? (
          <NoDataText option="Departamentos de Vendas" />
        ) : (
          <>
            {tableOrCardView ? (
              <DepartmentTable
                userId={userId}
                configData={config}
                toast={toast}
                users={users}
                managers={managers}
                departments={saleDepartments}
                openAdd={openAddDepartment}
                setOpenAdd={setOpenAddDepartment}
                refreshData={refreshData}
                setRefreshData={setRefreshData}
                topBar={topBar}
              />
            ) : (
              <Grid
                sx={{ mt: 0.5, width: topBar ? "107%" : "100%" }}
                container
                spacing={2}
              >
                {saleDepartments.map((department, index) => (
                  <Grid
                    item
                    key={index}
                    md={cardSize}
                    lg={cardSize}
                    xl={cardSize}
                  >
                    <DepartmentCard
                      userId={userId}
                      department={department}
                      configData={configData}
                      refreshData={refreshData}
                      setRefreshData={setRefreshData}
                      users={allUsers.map((user) => ({
                        _id: user._id,
                        image: user.image,
                      }))}
                      managers={managers}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
      </CustomTabPanel>
      {configTables.departmentInternal && (
        <CustomTabPanel value={value} index={2}>
          {internalDepartments.length === 0 ? (
            <NoDataText option="Departamentos Internos" />
          ) : (
            <>
              {tableOrCardView ? (
                <DepartmentTable
                  userId={userId}
                  configData={config}
                  toast={toast}
                  users={users}
                  managers={managers}
                  departments={internalDepartments}
                  openAdd={openAddDepartment}
                  setOpenAdd={setOpenAddDepartment}
                  refreshData={refreshData}
                  setRefreshData={setRefreshData}
                  topBar={topBar}
                />
              ) : (
                <Grid
                  sx={{ mt: 0.5, width: topBar ? "107%" : "100%" }}
                  container
                  spacing={2}
                >
                  {internalDepartments.map((department, index) => (
                    <Grid
                      item
                      key={index}
                      md={cardSize}
                      lg={cardSize}
                      xl={cardSize}
                    >
                      <DepartmentCard
                        userId={userId}
                        department={department}
                        configData={configData}
                        refreshData={refreshData}
                        setRefreshData={setRefreshData}
                        users={allUsers.map((user) => ({
                          _id: user._id,
                          image: user.image,
                        }))}
                        managers={managers}
                      />
                    </Grid>
                  ))}
                </Grid>
              )}
            </>
          )}
        </CustomTabPanel>
      )}
      <CustomTabPanel
        value={value}
        index={configTables.departmentInternal ? 3 : 2}
      >
        {groups.length === 0 ? (
          <NoDataText option="Grupos" />
        ) : (
          <>

            {tableOrCardView ? (
              <GroupTable
                userId={userId}
                configData={config}
                toast={toast}
                positions={positions}
                users={users}
                allUsers={allUsers.map((user) => ({
                  _id: user._id,
                  name: user.name,
                  image: user.image,
                }))}
                groups={groups}
                managers={managers}
                openAdd={openAddGroup}
                setOpenAdd={setOpenAddGroup}
                refreshData={refreshData}
                setRefreshData={setRefreshData}
                topBar={topBar}
              />
            ) : (
              <Grid
                sx={{ mt: 0.5, width: topBar ? "107%" : "100%" }}
                container
                spacing={2}
              >
                {groups.map((group, index) => (
                  <Grid
                    item
                    key={index}
                    md={cardSize}
                    lg={cardSize}
                    xl={cardSize}
                  >
                    <DepartmentCard
                      userId={userId}
                      group={group}
                      configData={configData}
                      refreshData={refreshData}
                      setRefreshData={setRefreshData}
                      users={allUsers.map((user) => ({
                        _id: user._id,
                        image: user.image,
                      }))}
                      managers={managers}
                      allUsers={allUsers}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
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
            userId={userId}
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
            userId={userId}
            userName={userName}
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
