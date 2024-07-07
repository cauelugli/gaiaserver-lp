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

import OperatorTable from "../tables/OperatorTable";
import PositionTable from "../tables/PositionTable";
import RoleTable from "../tables/RoleTable";

import AddOperatorForm from "../forms/add/AddOperatorForm";
import AddPositionForm from "../forms/add/AddPositionForm";
import AddRoleForm from "../forms/add/AddRoleForm";

import NoDataText from "../components/small/NoDataText";
import RefreshButton from "../components/small/buttons/RefreshButton";
import SecurityTableButton from "../components/small/buttons/tableButtons/SecurityTableButton";

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

export default function Security({ topBar, userId }) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [refreshData, setRefreshData] = React.useState(false);
  const [newDataRefreshButton, setNewDataRefreshButton] = React.useState(true);
  const [configCustomization, setConfigCustomization] = React.useState(false);
  React.useState(false);
  const [value, setValue] = React.useState(0);

  const [users, setUsers] = React.useState([]);
  const [managers, setManagers] = React.useState([]);
  const [operators, setOperators] = React.useState([]);
  const [positions, setPositions] = React.useState([]);
  const [departments, setDepartments] = React.useState([]);
  const [roles, setRoles] = React.useState([]);

  const [openAddOperator, setOpenAddOperator] = React.useState(false);
  const [openAddPosition, setOpenAddPosition] = React.useState(false);
  const [openAddRole, setOpenAddRole] = React.useState(false);

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
        const roles = await api.get("/roles");
        const positions = await api.get("/positions");
        const departments = await api.get("/departments");
        const usersData = users.data;
        const managersData = managers.data;
        const combinedData = [...usersData, ...managersData];
        const configCustomization = await api.get("/config");
        setConfigCustomization(configCustomization.data[0].customization);
        setUsers(usersData);
        setManagers(managersData);
        setOperators(combinedData);
        setPositions(positions.data);
        setDepartments(departments.data);
        setRoles(roles.data);
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
        sx={{ ml: 2 }}
      >
        <Typography sx={{ fontSize: 25, mr: 1, fontWeight: "bold" }}>
          Segurança de Acessos
        </Typography>
        <SecurityTableButton
          anchorEl={anchorEl}
          openAddButton={openAddButton}
          handleClickAddButton={handleClickAddButton}
          handleCloseAddButton={handleCloseAddButton}
          setOpenAddOperator={setOpenAddOperator}
          setOpenAddPosition={setOpenAddPosition}
          setOpenAddRole={setOpenAddRole}
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
            label={<Typography sx={{ fontSize: 13 }}>Operadores</Typography>}
            sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
          />
          <Tab
            label={<Typography sx={{ fontSize: 13 }}>Cargos</Typography>}
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
            configCustomization={configCustomization}
            userId={userId}
            newDataRefreshButton={newDataRefreshButton}
            setNewDataRefreshButton={setNewDataRefreshButton}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {users.length === 0 ? (
          <NoDataText option="Operadores" />
        ) : (
          <>
            <OperatorTable
              roles={roles}
              refreshData={refreshData}
              setRefreshData={setRefreshData}
              topBar={topBar}
            />
          </>
        )}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {positions.length === 0 ? (
          <NoDataText option="Cargos" />
        ) : (
          <>

            <PositionTable
              toast={toast}
              departments={departments}
              positions={positions}
              users={users}
              managers={managers}
              openAdd={openAddPosition}
              setOpenAdd={setOpenAddPosition}
              refreshData={refreshData}
              setRefreshData={setRefreshData}
              topBar={topBar}
            />
          </>
        )}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        {roles.length === 0 ? (
          <NoDataText option="Perfil de Acesso" />
        ) : (
          <>
            <RoleTable
              users={users}
              managers={managers}
              refreshData={refreshData}
              setRefreshData={setRefreshData}
              topBar={topBar}
            />
          </>
        )}
      </CustomTabPanel>
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
            configCustomization={configCustomization}
            setOpenAdd={setOpenAddOperator}
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
            departments={departments}
            openAdd={openAddPosition}
            setOpenAdd={setOpenAddPosition}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            configCustomization={configCustomization}
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
            configCustomization={configCustomization}
            toast={toast}
          />
        </Dialog>
      )}
    </Box>
  );
}
