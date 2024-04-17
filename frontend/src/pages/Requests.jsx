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

import JobTable from "../tables/JobTable";
import SaleTable from "../tables/SaleTable";

import AddJobForm from "../forms/add/AddJobForm";
import AddSaleForm from "../forms/add/AddSaleForm";

import TableFilters from "../components/TableFilters";
import RefreshButton from "../components/small/buttons/RefreshButton";
import NoDataText from "../components/small/NoDataText";
import RequestTableButton from "../components/small/buttons/tableButtons/RequestTableButton";

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

export default function Requests({
  userId,
  userName,
  userUsername,
  userRole,
  configTables,
  configAgenda,
  configNotifications,
  configNotificationsBooleans,
}) {
  const [isLoading, setIsLoading] = React.useState(true);

  const [refreshData, setRefreshData] = React.useState(false);
  const [configCustomization, setConfigCustomization] = React.useState(false);
  const [value, setValue] = React.useState(0);

  const [openAddJob, setOpenAddJob] = React.useState(false);
  const [openAddSale, setOpenAddSale] = React.useState(false);

  const [searchValue, setSearchValue] = React.useState("");
  const [searchOption, setSearchOption] = React.useState("requester");
  const [searchOptionLabel, setSearchOptionLabel] =
    React.useState("Solicitante");
  const searchOptionList = [
    {
      // JOBS TABLE
      options: [
        { value: "requester", label: "Solicitante" },
        { value: "createdBy", label: "Criado por" },
        { value: "worker.name", label: "Designado" },
        { value: "scheduledTo", label: "Data do Agendamento" },
      ],
    },
    {
      // SALES TABLE
      options: [
        { value: "requester", label: "Solicitante" },
        { value: "createdBy", label: "Criado por" },
        { value: "seller.name", label: "Vendedor" },
        { value: "deliveryScheduledTo", label: "Data de Entrega" },
      ],
    },
  ];

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const openAddButton = Boolean(anchorEl);

  const [jobs, setJobs] = React.useState([]);
  const [sales, setSales] = React.useState([]);
  const [managers, setManagers] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const jobs = await api.get("/jobs");
        const sales = await api.get("/sales");
        const managers = await api.get("/managers");
        const config = await api.get("/config");
        setConfigCustomization(config.data[0].customization);
        setJobs(jobs.data);
        setSales(sales.data);
        setManagers(managers.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [refreshData]);

  const handleClickAddButton = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseAddButton = () => {
    setAnchorEl(null);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setSearchValue("");
    setSearchOption("requester");
    setSearchOptionLabel("Solicitante");
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
          Solicitações
        </Typography>
        <RequestTableButton
          anchorEl={anchorEl}
          openAddButton={openAddButton}
          handleClickAddButton={handleClickAddButton}
          handleCloseAddButton={handleCloseAddButton}
          setOpenAddSale={setOpenAddSale}
          setOpenAddJob={setOpenAddJob}
          configCustomization={configCustomization}
        />
      </Grid>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          TabIndicatorProps={{ style: { backgroundColor: "black" } }}
        >
          {configTables.requestJob && (
            <Tab
              label={<Typography sx={{ fontSize: 13 }}>Jobs</Typography>}
              sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
            />
          )}
          {configTables.requestSale && (
            <Tab
              label={<Typography sx={{ fontSize: 13 }}>Vendas</Typography>}
              sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
            />
          )}
          <RefreshButton
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            configCustomization={configCustomization}
          />
        </Tabs>
      </Box>
      {configTables.requestJob && (
        <CustomTabPanel value={value} index={0}>
          {jobs.length === 0 ? (
            <NoDataText option="Jobs" />
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

              <JobTable
                userId={userId}
                userName={userName}
                userUsername={userUsername}
                userRole={userRole}
                searchValue={searchValue}
                searchOption={searchOption}
                jobs={jobs}
                managers={managers}
                refreshData={refreshData}
                setRefreshData={setRefreshData}
              />
            </>
          )}
        </CustomTabPanel>
      )}
      {configTables.requestSale && (
        <CustomTabPanel value={value} index={configTables.requestJob ? 1 : 0}>
          {sales.length === 0 ? (
            <NoDataText option="Vendas" femaleGender={true} />
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

              <SaleTable
                userId={userId}
                userName={userName}
                userUsername={userUsername}
                searchValue={searchValue}
                searchOption={searchOption}
                sales={sales}
                managers={managers}
                refreshData={refreshData}
                setRefreshData={setRefreshData}
              />
            </>
          )}
        </CustomTabPanel>
      )}
      {openAddJob && (
        <Dialog
          fullWidth
          maxWidth="lg"
          open={openAddJob}
          onClose={() => setOpenAddJob(!openAddJob)}
        >
          <AddJobForm
            userName={userName}
            openAddJob={openAddJob}
            configNotifications={configNotifications}
            configNotificationsBooleans={configNotificationsBooleans}
            setOpenAddJob={setOpenAddJob}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            configAgenda={configAgenda}
            toast={toast}
          />
        </Dialog>
      )}
      {openAddSale && (
        <Dialog
          fullWidth
          maxWidth="md"
          open={openAddSale}
          onClose={() => setOpenAddSale(!openAddSale)}
        >
          <AddSaleForm
            userName={userName}
            openAddSale={openAddSale}
            setOpenAddSale={setOpenAddSale}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            toast={toast}
          />
        </Dialog>
      )}
    </Box>
  );
}
