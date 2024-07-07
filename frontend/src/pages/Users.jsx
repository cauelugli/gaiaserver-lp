/* eslint-disable react/prop-types */
import * as React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

import UserTable from "../tables/UserTable";
import ManagerTable from "../tables/ManagerTable";

import AddUserForm from "../forms/add/AddUserForm";
import AddManagerForm from "../forms/add/AddManagerForm";

import NoDataText from "../components/small/NoDataText";
import RefreshButton from "../components/small/buttons/RefreshButton";
import UserTableButton from "../components/small/buttons/tableButtons/UserTableButton";
import TableOrCardSelector from "../components/small/TableOrCardSelector";
import UserCard from "../components/cards/UserCard";

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

export default function Users({
  configData,
  userName,
  userId,
  topBar,
  setUserPreferences,
  tableOrCardView,
  cardSize,
}) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [refreshData, setRefreshData] = React.useState(false);
  const [newDataRefreshButton, setNewDataRefreshButton] = React.useState(true);
  const [configUsers, setConfigUsers] = React.useState(false);
  const [configManagers, setConfigManagers] = React.useState(false);
  const [configCustomization, setConfigCustomization] = React.useState(false);
  const [configNotifications, setConfigNotifications] = React.useState(false);
  const [configNotificationsBooleans, setConfigNotificationsBooleans] =
    React.useState(false);
  const [value, setValue] = React.useState(0);

  const [users, setUsers] = React.useState([]);
  const [managers, setManagers] = React.useState([]);
  const [departments, setDepartments] = React.useState([]);
  const [positions, setPositions] = React.useState([]);

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
        const departments = await api.get("/departments");
        const managers = await api.get("/managers");
        const positions = await api.get("/positions");
        const users = await api.get("/users");
        const config = await api.get("/config");
        setDepartments(departments.data);
        setManagers(managers.data);
        setPositions(positions.data);
        setUsers(users.data);
        setConfigCustomization(config.data[0].customization);
        setConfigManagers(config.data[0].managers);
        setConfigNotifications(config.data[0].notifications);
        setConfigNotificationsBooleans(config.data[0].notificationsBooleans);
        setConfigUsers(config.data[0].users);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [refreshData]);

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
          Colaboradores
        </Typography>
        <UserTableButton
          anchorEl={anchorEl}
          openAddButton={openAddButton}
          handleClickAddButton={handleClickAddButton}
          handleCloseAddButton={handleCloseAddButton}
          setOpenAddUser={setOpenAddUser}
          setOpenAddManager={setOpenAddManager}
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
            label={<Typography sx={{ fontSize: 13 }}>Funcionários</Typography>}
            sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
          />
          <Tab
            label={<Typography sx={{ fontSize: 13 }}>Gerentes</Typography>}
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
        {users.length === 1 ? (
          <NoDataText option="Colaborardores" />
        ) : (
          <>
            {tableOrCardView ? (
              <UserTable
                userId={userId}
                refreshData={refreshData}
                setRefreshData={setRefreshData}
                configData={configUsers}
                topBar={topBar}
              />
            ) : (
              <Grid
                sx={{ mt: 0.5, width: topBar ? "107%" : "100%" }}
                container
                spacing={2}
              >
                {" "}
                {users
                  .filter((user) => user.username !== "admin")
                  .map((user, index) => (
                    <Grid
                      item
                      key={index}
                      md={cardSize}
                      lg={cardSize}
                      xl={cardSize}
                    >
                      <UserCard
                        userId={userId}
                        type="user"
                        user={user}
                        departments={departments}
                        positions={positions}
                        refreshData={refreshData}
                        setRefreshData={setRefreshData}
                        configData={configData}
                      />
                    </Grid>
                  ))}
              </Grid>
            )}
          </>
        )}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {managers.length === 0 ? (
          <NoDataText option="Gerentes" />
        ) : (
          <>

            {tableOrCardView ? (
              <ManagerTable
                userId={userId}
                positions={positions}
                configData={configManagers}
                refreshData={refreshData}
                setRefreshData={setRefreshData}
                searchValue={"searchValue"}
                searchOption={"searchOption"}
                topBar={topBar}
              />
            ) : (
              <Grid
                sx={{ mt: 0.5, width: topBar ? "107%" : "100%" }}
                container
                spacing={2}
              >
                {managers.map((manager, index) => (
                  <Grid
                    item
                    key={index}
                    md={cardSize}
                    lg={cardSize}
                    xl={cardSize}
                  >
                    <UserCard
                      userId={userId}
                      type="manager"
                      user={manager}
                      departments={departments}
                      positions={positions}
                      configData={configData}
                      refreshData={refreshData}
                      setRefreshData={setRefreshData}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
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
            userName={userName}
            userId={userId}
            configCustomization={configCustomization}
            configNotifications={configNotifications}
            configNotificationsBooleans={configNotificationsBooleans}
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
            positions={positions}
            userName={userName}
            userId={userId}
            configCustomization={configCustomization}
            openAdd={openAddManager}
            setOpenAdd={setOpenAddManager}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            toast={toast}
          />
        </Dialog>
      )}
    </Box>
  );
}
