/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import * as React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

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

import ApartmentIcon from "@mui/icons-material/Apartment";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

import CustomerTable from "../tables/CustomerTable";
import ClientTable from "../tables/ClientTable";

import AddClientForm from "../forms/add/AddClientForm";
import AddCustomerForm from "../forms/add/AddCustomerForm";
import NoDataText from "../components/small/NoDataText";
import RefreshButton from "../components/small/buttons/RefreshButton";

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

export default function Customers({ user }) {
  const [refreshData, setRefreshData] = React.useState(false);
  const [value, setValue] = React.useState(0);
  const [clients, setClients] = React.useState([]);
  const [customers, setCustomers] = React.useState([]);

  const [openAddCustomer, setOpenAddCustomer] = React.useState(false);
  const [openAddClient, setOpenAddClient] = React.useState(false);

  const [searchOption, setSearchOption] = React.useState("name");
  const [searchOptionLabel, setSearchOptionLabel] = React.useState("Nome");
  const [searchValue, setSearchValue] = React.useState("");

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
        const customers = await api.get("/customers");
        const clients = await api.get("/clients");
        setClients(clients.data);
        setCustomers(customers.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [refreshData]);

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
          Clientes
        </Typography>
        <div>
          <Button
            id="basic-button"
            aria-controls={openAddButton ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openAddButton ? "true" : undefined}
            onClick={handleClickAddButton}
            variant="outlined"
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
              <MenuItem onClick={() => setOpenAddCustomer(!openAddCustomer)}>
                <ListItemIcon>
                  <ApartmentIcon />
                </ListItemIcon>
                <ListItemText>Empresa</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => setOpenAddClient(!openAddClient)}>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText>Pessoa Física</ListItemText>
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
            label={<Typography sx={{ fontSize: 14 }}>Empresas</Typography>}
            sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
          />
          <Tab
            label={<Typography sx={{ fontSize: 14 }}>Pessoa Física</Typography>}
            sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
          />
          <RefreshButton
            refreshData={refreshData}
            setRefreshData={setRefreshData}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {customers.length === 0 ? (
          <NoDataText option="Clientes Empresa" />
        ) : (
          <>
            <Grid container direction="row" justifyContent="flex-start">
              <Grid item>
                <TextField
                  placeholder={`Pesquise por ${searchOptionLabel}...`}
                  size="small"
                  sx={{ mb: 1, ml: "2%", width: 350 }}
                  value={searchValue}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    endAdornment:
                      searchValue.length > 0 ? (
                        <InputAdornment position="end">
                          <ClearIcon
                            cursor="pointer"
                            sx={{ color: "#d21404" }}
                            onClick={() => setSearchValue("")}
                          />
                        </InputAdornment>
                      ) : (
                        ""
                      ),
                  }}
                />
              </Grid>
              <Grid item sx={{ ml: "3%" }}>
                <Select
                  value={searchOption}
                  onChange={(e) => {
                    setSearchOption(e.target.value),
                      setSearchOptionLabel(e.explicitOriginalTarget.innerText);
                  }}
                  size="small"
                  sx={{ minWidth: 180, color: "#777" }}
                  renderValue={() => (
                    <Typography>Filtrar por</Typography>
                  )}
                >
                  <MenuItem value="name">Nome</MenuItem>
                  <MenuItem value="mainContactName">Contato Principal</MenuItem>
                </Select>
              </Grid>
            </Grid>
            <CustomerTable
              refreshData={refreshData}
              setRefreshData={setRefreshData}
              searchValue={searchValue}
              searchOption={searchOption}
            />
          </>
        )}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {clients.length === 0 ? (
          <NoDataText option="Clientes Pessoa Física" />
        ) : (
          <>
            <Grid container direction="row" justifyContent="flex-start">
              <Grid item>
                <TextField
                  placeholder={`Pesquise por ${searchOptionLabel}...`}
                  size="small"
                  sx={{ mb: 1, ml: "2%", width: 350 }}
                  value={searchValue}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    endAdornment:
                      searchValue.length > 0 ? (
                        <InputAdornment position="end">
                          <ClearIcon
                            cursor="pointer"
                            sx={{ color: "#d21404" }}
                            onClick={() => setSearchValue("")}
                          />
                        </InputAdornment>
                      ) : (
                        ""
                      ),
                  }}
                />
              </Grid>
              <Grid item sx={{ ml: "3%" }}>
                <Select
                  value={searchOption}
                  onChange={(e) => {
                    setSearchOption(e.target.value),
                      setSearchOptionLabel(e.explicitOriginalTarget.innerText);
                  }}
                  size="small"
                  sx={{ minWidth: 180, color: "#777" }}
                  renderValue={() => (
                    <Typography>Filtrar por</Typography>
                  )}
                >
                  <MenuItem value="name">Nome</MenuItem>
                  <MenuItem value="email">E-mail</MenuItem>
                  <MenuItem value="phone">Telefone</MenuItem>
                </Select>
              </Grid>
            </Grid>
            <ClientTable
              refreshData={refreshData}
              setRefreshData={setRefreshData}
              searchValue={searchValue}
              searchOption={searchOption}
            />
          </>
        )}
      </CustomTabPanel>

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
          />
        </Dialog>
      )}
    </Box>
  );
}
