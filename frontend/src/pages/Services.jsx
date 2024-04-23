/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
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

import ServiceTable from "../tables/ServiceTable";
import ServicePlansTable from "../tables/ServicePlansTable";

import AddServiceForm from "../forms/add/AddServiceForm";
import AddServicePlanForm from "../forms/add/AddServicePlanForm";

import TableFilters from "../components/TableFilters";
import RefreshButton from "../components/small/buttons/RefreshButton";
import NoDataText from "../components/small/NoDataText";
import ServicesTableButton from "../components/small/buttons/tableButtons/ServicesTableButton";
import TableOrCardSelector from "../components/small/TableOrCardSelector";
import ServiceCard from "../components/cards/ServiceCard";

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

export default function Services({
  userId,
  configTables,
  configData,
  topBar,
  tableOrCardView,
  setUserPreferences,
}) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [refreshData, setRefreshData] = React.useState(false);
  const [value, setValue] = React.useState(0);
  const [configCustomization, setConfigCustomization] = React.useState(0);

  const [openAddService, setOpenAddService] = React.useState(false);
  const [openAddServicePlan, setOpenAddServicePlan] = React.useState(false);

  const [searchValue, setSearchValue] = React.useState("");
  const [searchOption, setSearchOption] = React.useState("name");
  const [searchOptionLabel, setSearchOptionLabel] = React.useState("Nome");
  const searchOptionList = [
    {
      // SERVICES TABLE
      options: [
        { value: "number", label: "Número" },
        { value: "department.name", label: "Departamento" },
      ],
    },
    {
      // SUPPORTS TABLE
      options: [
        { value: "number", label: "Número" },
        { value: "department.name", label: "Departamento" },
      ],
    },
    {
      // SERVICE PLANS TABLE
      options: [{ value: "number", label: "Número" }],
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

  const [services, setServices] = React.useState([]);
  const [servicePlans, setServicePlans] = React.useState([]);
  const [supports, setSupports] = React.useState([]);
  const [departments, setDepartments] = React.useState([]);
  const [stockItems, setStockItems] = React.useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setSearchValue("");
    setSearchOption("name");
    setSearchOptionLabel("Nome");
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const services = await api.get("/services");
        const servicePlans = await api.get("/servicePlans");
        const departments = await api.get("/departments");
        const stockItems = await api.get("/stockItems");
        const configCustomization = await api.get("/config");
        setServices(services.data.filter((service) => service.value > 0));
        setSupports(services.data.filter((service) => service.value === 0));
        setServicePlans(servicePlans.data);
        setConfigCustomization(configCustomization.data[0].customization);
        setDepartments(departments.data);
        setStockItems(stockItems.data);
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
          Serviços
        </Typography>
        <ServicesTableButton
          anchorEl={anchorEl}
          openAddButton={openAddButton}
          handleClickAddButton={handleClickAddButton}
          handleCloseAddButton={handleCloseAddButton}
          setOpenAddService={setOpenAddService}
          setOpenAddServicePlan={setOpenAddServicePlan}
          configCustomization={configCustomization}
          configData={configData}
        />
      </Grid>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          TabIndicatorProps={{ style: { backgroundColor: "black" } }}
        >
          <Tab
            label={<Typography sx={{ fontSize: 13 }}>Setores</Typography>}
            sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
          />
          {configTables.serviceConsulting && (
            <Tab
              label={<Typography sx={{ fontSize: 13 }}>Consultoria</Typography>}
              sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
            />
          )}
          {configTables.servicePlan && (
            <Tab
              label={<Typography sx={{ fontSize: 13 }}>Planos</Typography>}
              sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
            />
          )}
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
            />
          </Grid>
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {services.length === 0 ? (
          <NoDataText option="Serviços" />
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
              <ServiceTable
                configData={configData}
                searchOption={searchOption}
                searchValue={searchValue}
                services={services}
                departments={departments}
                stockItems={stockItems}
                refreshData={refreshData}
                setRefreshData={setRefreshData}
                topBar={topBar}
              />
            ) : (
              <Grid sx={{ mt: 0.5, width: "107%" }} container rowSpacing={2}>
                {services.map((service) => (
                  <Grid key item md={3} lg={3} xl={2}>
                    <ServiceCard key service={service} />
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
      </CustomTabPanel>
      {configTables.serviceConsulting && (
        <CustomTabPanel value={value} index={1}>
          {supports.length === 0 ? (
            <NoDataText option="Serviços de Consultoria" />
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
                <ServiceTable
                  searchOption={searchOption}
                  searchValue={searchValue}
                  services={supports}
                  departments={departments}
                  stockItems={stockItems}
                  refreshData={refreshData}
                  setRefreshData={setRefreshData}
                  topBar={topBar}
                />
              ) : (
                <Grid sx={{ mt: 0.5, width: "107%" }} container rowSpacing={2}>
                  {supports.map((service) => (
                    <Grid key item md={3} lg={3} xl={2}>
                      <ServiceCard key service={service} />
                    </Grid>
                  ))}
                </Grid>
              )}
            </>
          )}
        </CustomTabPanel>
      )}
      {configTables.servicePlan && (
        <CustomTabPanel
          value={value}
          index={configTables.serviceConsulting ? 2 : 1}
        >
          {servicePlans.length === 0 ? (
            <NoDataText option="Planos de Serviços" />
          ) : (
            <>
              {tableOrCardView && (
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
              )}
              {tableOrCardView ? (
                <ServicePlansTable
                  searchOption={searchOption}
                  searchValue={searchValue}
                  servicePlans={servicePlans}
                  refreshData={refreshData}
                  setRefreshData={setRefreshData}
                  topBar={topBar}
                />
              ) : (
                <Grid sx={{ mt: 0.5, width: "107%" }} container rowSpacing={2}>
                  {servicePlans.map((servicePlan) => (
                    <Grid key item md={3} lg={3} xl={2}>
                      <ServiceCard key servicePlan={servicePlan} />
                    </Grid>
                  ))}
                </Grid>
              )}
            </>
          )}
        </CustomTabPanel>
      )}
      {openAddService && (
        <Dialog
          fullWidth
          maxWidth="md"
          open={openAddService}
          onClose={() => setOpenAddService(!openAddService)}
        >
          <AddServiceForm
            openAdd={openAddService}
            setOpenAdd={setOpenAddService}
            departments={departments}
            stockItems={stockItems}
            refreshData={refreshData}
            configCustomization={configCustomization}
            setRefreshData={setRefreshData}
            toast={toast}
          />
        </Dialog>
      )}
      {openAddServicePlan && (
        <Dialog
          fullWidth
          maxWidth="md"
          open={openAddServicePlan}
          onClose={() => setOpenAddServicePlan(!openAddServicePlan)}
        >
          <AddServicePlanForm
            openAdd={openAddServicePlan}
            setOpenAdd={setOpenAddServicePlan}
            departments={departments}
            configCustomization={configCustomization}
            stockItems={stockItems}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            toast={toast}
          />
        </Dialog>
      )}
    </Box>
  );
}
