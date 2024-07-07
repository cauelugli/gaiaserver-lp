/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
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

import ServiceTable from "../tables/ServiceTable";
import ServicePlansTable from "../tables/ServicePlansTable";

import AddServiceForm from "../forms/add/AddServiceForm";
import AddServicePlanForm from "../forms/add/AddServicePlanForm";

import RefreshButton from "../components/small/buttons/RefreshButton";
import NoDataText from "../components/small/NoDataText";
import ServicesTableButton from "../components/small/buttons/tableButtons/ServicesTableButton";
import TableOrCardSelector from "../components/small/TableOrCardSelector";
import ServiceCard from "../components/cards/ServiceCard";

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
  cardSize,
}) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [refreshData, setRefreshData] = React.useState(false);
  const [newDataRefreshButton, setNewDataRefreshButton] = React.useState(true);
  const [value, setValue] = React.useState(0);
  const [configCustomization, setConfigCustomization] = React.useState(0);

  const [openAddService, setOpenAddService] = React.useState(false);
  const [openAddServicePlan, setOpenAddServicePlan] = React.useState(false);

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
    <Box sx={{ minHeight: "50vw" }}>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        sx={{ ml: 2 }}
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
        {services.length === 0 ? (
          <NoDataText option="Serviços" />
        ) : (
          <>
            {tableOrCardView ? (
              <ServiceTable
                userId={userId}
                configData={configData}
                services={services}
                departments={departments}
                stockItems={stockItems}
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
                {services.map((service, index) => (
                  <Grid
                    item
                    key={index}
                    md={cardSize}
                    lg={cardSize}
                    xl={cardSize}
                  >
                    <ServiceCard
                      userId={userId}
                      service={service}
                      configData={configData.services}
                      selectedItem={service}
                      refreshData={refreshData}
                      setRefreshData={setRefreshData}
                      toast={toast}
                      departments={departments}
                      stockItems={stockItems}
                    />
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
              {tableOrCardView ? (
                <ServiceTable
                  userId={userId}
                  configData={configData}
                  services={supports}
                  departments={departments}
                  stockItems={stockItems}
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
                  {supports.map((service, index) => (
                    <Grid
                      item
                      key={index}
                      md={cardSize}
                      lg={cardSize}
                      xl={cardSize}
                    >
                      <ServiceCard
                        userId={userId}
                        service={service}
                        configData={configData.services}
                        selectedItem={service}
                        refreshData={refreshData}
                        setRefreshData={setRefreshData}
                        toast={toast}
                        departments={departments}
                        stockItems={stockItems}
                      />
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
              {tableOrCardView ? (
                <ServicePlansTable
                  servicePlans={servicePlans}
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
                  {servicePlans.map((servicePlan, index) => (
                    <Grid
                      item
                      key={index}
                      md={cardSize}
                      lg={cardSize}
                      xl={cardSize}
                    >
                      <ServiceCard
                        userId={userId}
                        servicePlan={servicePlan}
                        configData=""
                        selectedItem={servicePlan}
                        refreshData={refreshData}
                        setRefreshData={setRefreshData}
                        toast={toast}
                        departments={departments}
                        stockItems={stockItems}
                      />
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
            userId={userId}
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
            userId={userId}
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
