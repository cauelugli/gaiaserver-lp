/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
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

import CustomerTable from "../tables/CustomerTable";
import ClientTable from "../tables/ClientTable";
import AddClientForm from "../forms/add/AddClientForm";
import AddCustomerForm from "../forms/add/AddCustomerForm";

import NoDataText from "../components/small/NoDataText";
import RefreshButton from "../components/small/buttons/RefreshButton";
import TableFilters from "../components/TableFilters";
import ImportContacts from "../forms/misc/ImportContacts";
import CustomerTableButton from "../components/small/buttons/tableButtons/CustomerTableButton";
import TableOrCardSelector from "../components/small/TableOrCardSelector";
import CustomerCard from "../components/cards/CustomerCard";

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

export default function Customers({
  userName,
  userId,
  tableOrCardView,
  cardSize,
  setUserPreferences,
  topBar,
  configTables,
  configAgenda,
  configNotifications,
  configNotificationsBooleans,
}) {
  const [isLoading, setIsLoading] = React.useState(true);

  const [refreshData, setRefreshData] = React.useState(false);
  const [config, setConfig] = React.useState(false);
  const [configCustomization, setConfigCustomization] = React.useState(false);

  const [value, setValue] = React.useState(0);
  const [clients, setClients] = React.useState([]);
  const [customers, setCustomers] = React.useState([]);

  const [openAddCustomer, setOpenAddCustomer] = React.useState(false);
  const [openAddClient, setOpenAddClient] = React.useState(false);
  const [openImportContacts, setOpenImportContacts] = React.useState(false);

  const [searchOption, setSearchOption] = React.useState("name");
  const [searchOptionLabel, setSearchOptionLabel] = React.useState("Nome");
  const [searchValue, setSearchValue] = React.useState("");

  const searchOptionList = [
    {
      // CUSTOMER TABLE
      options: [
        { value: "name", label: "Nome" },
        { value: "mainContactName", label: "Contato Principal" },
      ],
    },
    {
      // CLIENT TABLE
      options: [
        { value: "name", label: "Nome" },
        { value: "email", label: "E-mail" },
        { value: "phone", label: "Telefone" },
      ],
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
        const clients = await api.get("/clients");
        const config = await api.get("/config");
        const customers = await api.get("/customers");
        setClients(clients.data);
        setConfig(config.data[0].customers);
        setConfigCustomization(config.data[0].customization);
        setCustomers(customers.data);
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
          Clientes
        </Typography>
        <CustomerTableButton
          anchorEl={anchorEl}
          openAddButton={openAddButton}
          handleClickAddButton={handleClickAddButton}
          handleCloseAddButton={handleCloseAddButton}
          setOpenAddCustomer={setOpenAddCustomer}
          setOpenAddClient={setOpenAddClient}
          setOpenImportContacts={setOpenImportContacts}
          configCustomization={configCustomization}
          configAgenda={configAgenda}
        />
      </Grid>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          TabIndicatorProps={{ style: { backgroundColor: "black" } }}
        >
          {configTables.customerCustomer && (
            <Tab
              label={<Typography sx={{ fontSize: 13 }}>Empresas</Typography>}
              sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
            />
          )}
          {configTables.customerClient && (
            <Tab
              label={
                <Typography sx={{ fontSize: 13 }}>Pessoa Física</Typography>
              }
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
              cardSize={cardSize}
            />
          </Grid>
        </Tabs>
      </Box>

      {configTables.customerCustomer && (
        <CustomTabPanel value={value} index={0}>
          {customers.length === 0 ? (
            <NoDataText option="Clientes Empresa" />
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
                <CustomerTable
                  userName={userName}
                  configCustomization={configCustomization}
                  configNotifications={configNotifications}
                  configNotificationsBooleans={configNotificationsBooleans}
                  configData={config}
                  configAgenda={configAgenda}
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
                  {customers.map((customer) => (
                    <Grid key item md={cardSize} lg={cardSize} xl={cardSize}>
                      <CustomerCard key customer={customer} type="customer" />
                    </Grid>
                  ))}
                </Grid>
              )}
            </>
          )}
        </CustomTabPanel>
      )}

      {configTables.customerClient && (
        <CustomTabPanel
          value={value}
          index={configTables.customerCustomer ? 1 : 0}
        >
          {clients.length === 0 ? (
            <NoDataText option="Clientes Pessoa Física" />
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
                <ClientTable
                  userName={userName}
                  configAgenda={configAgenda}
                  configNotifications={configNotifications}
                  configNotificationsBooleans={configNotificationsBooleans}
                  configCustomization={configCustomization}
                  configData={config}
                  refreshData={refreshData}
                  setRefreshData={setRefreshData}
                  searchValue={searchValue}
                  searchOption={searchOption}
                  topBar={topBar}
                />
              ) : (
                <Grid sx={{ mt: 0.5, width: "107%" }} container rowSpacing={2}>
                  {clients.map((client) => (
                    <Grid key item md={cardSize} lg={cardSize} xl={cardSize}>
                      <CustomerCard key customer={client} type="client" />
                    </Grid>
                  ))}
                </Grid>
              )}
            </>
          )}
        </CustomTabPanel>
      )}

      {openAddCustomer && (
        <Dialog
          fullWidth
          maxWidth="md"
          open={openAddCustomer}
          onClose={() => setOpenAddCustomer(!openAddCustomer)}
        >
          <AddCustomerForm
            openAdd={openAddCustomer}
            setOpenAdd={setOpenAddCustomer}
            toast={toast}
            config={config}
            configCustomization={configCustomization}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
          />
        </Dialog>
      )}
      {openAddClient && (
        <Dialog
          fullWidth
          maxWidth="xs"
          open={openAddClient}
          onClose={() => setOpenAddClient(!openAddClient)}
        >
          <AddClientForm
            openAdd={openAddClient}
            setOpenAdd={setOpenAddClient}
            toast={toast}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            configCustomization={configCustomization}
            extraSmall
          />
        </Dialog>
      )}
      {openImportContacts && (
        <Dialog
          fullWidth
          maxWidth="lg"
          open={openImportContacts}
          onClose={() => setOpenImportContacts(!openImportContacts)}
        >
          <ImportContacts
            openAdd={openImportContacts}
            setOpenAdd={setOpenImportContacts}
            toast={toast}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
          />
        </Dialog>
      )}
    </Box>
  );
}
