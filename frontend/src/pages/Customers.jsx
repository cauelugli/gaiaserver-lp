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
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

import ApartmentIcon from "@mui/icons-material/Apartment";
import PersonIcon from "@mui/icons-material/Person";

import CustomerTable from "../tables/CustomerTable";
import ClientTable from "../tables/ClientTable";

import AddClientForm from "../forms/add/AddClientForm";
import AddCustomerForm from "../forms/add/AddCustomerForm";

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

export default function Customers() {
  const [value, setValue] = React.useState(0);
  const [clients, setClients] = React.useState([]);

  const [openAddCustomer, setOpenAddCustomer] = React.useState(false);
  const [openAddClient, setOpenAddClient] = React.useState(false);

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
        const response = await api.get("/clients");
        setClients(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [clients]);

  const fetchData = async () => {
    try {
      const response = await api.get("/jobs");
      setClients(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

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
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <CustomerTable />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <ClientTable />
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
            fetchData={fetchData}
          />
        </Dialog>
      )}
    </Box>
  );
}
