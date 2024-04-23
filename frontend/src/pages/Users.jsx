/* eslint-disable react/prop-types */
import * as React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

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

import TableFilters from "../components/TableFilters";
import NoDataText from "../components/small/NoDataText";
import RefreshButton from "../components/small/buttons/RefreshButton";
import UserTableButton from "../components/small/buttons/tableButtons/UserTableButton";
import TableOrCardSelector from "../components/small/TableOrCardSelector";
import UserCard from "../components/cards/UserCard";

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

export default function Users({
  userName,
  userId,
  topBar,
  setUserPreferences,
  tableOrCardView,
  cardSize,
}) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [refreshData, setRefreshData] = React.useState(false);
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
        { value: "role", label: "Perfil de Acesso" },
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
    <Box>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        sx={{ m: 2 }}
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
            {tableOrCardView && (
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
            )}

            {tableOrCardView ? (
              <UserTable
                refreshData={refreshData}
                setRefreshData={setRefreshData}
                searchValue={searchValue}
                configData={configUsers}
                // searchDepartment={searchDepartment}
                searchOption={searchOption}
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
                  .map((user) => (
                    <Grid key item md={cardSize} lg={cardSize} xl={cardSize}>
                      <UserCard key user={user} type="user" />
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
            {tableOrCardView && (
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
            )}

            {tableOrCardView ? (
              <ManagerTable
                positions={positions}
                configData={configManagers}
                refreshData={refreshData}
                setRefreshData={setRefreshData}
                searchValue={searchValue}
                searchOption={searchOption}
                topBar={topBar}
              />
            ) : (
              <Grid
                sx={{ mt: 0.5, width: topBar ? "107%" : "100%" }}
                container
                spacing={2}
              >
                {managers.map((manager) => (
                  <Grid key item md={cardSize} lg={cardSize} xl={cardSize}>
                    <UserCard key user={manager} type="manager" />
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
