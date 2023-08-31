/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import * as React from "react";
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

import EngineeringIcon from "@mui/icons-material/Engineering";
import SellIcon from "@mui/icons-material/Sell";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

import JobTable from "../tables/JobTable";
import SaleTable from "../tables/SaleTable";
import SupportTable from "../tables/SupportTable";

import AddJobForm from "../forms/add/AddJobForm";

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
  selectedCustomer,
  customers,
  departments,
  services,
  latestJobNumber,
  fetchData
}) {
  const [value, setValue] = React.useState(0);

  const [openAddJob, setOpenAddJob] = React.useState(true);
  const [openAddSaleRequest, setOpenAddSaleRequest] = React.useState(false);
  const [openAddSupportRequest, setOpenAddSupportRequest] =
    React.useState(false);

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


  return (
    <Box sx={{ minWidth: "120%" }}>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <Typography variant="h4" sx={{ mr: 2 }}>
          Pedidos
        </Typography>
        <div>
          <Button
            id="basic-button"
            aria-controls={openAddButton ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openAddButton ? "true" : undefined}
            onClick={handleClickAddButton}
            variant="outlined"
            sx={{
              borderColor: "#eee",
              borderRadius: 3,
              mb: 1,
              "&:hover": { borderColor: "#eee" },
            }}
          >
            <Typography variant="h6" color="#eee">
              + Novo
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
            <MenuList sx={{ width: 130 }}>
              <MenuItem
                onClick={() => setOpenAddJob(!openAddJob)}
              >
                <ListItemIcon>
                  <EngineeringIcon />
                </ListItemIcon>
                <ListItemText>Job</ListItemText>
              </MenuItem>
              <MenuItem
                onClick={() => setOpenAddSaleRequest(!openAddSaleRequest)}
              >
                <ListItemIcon>
                  <SellIcon />
                </ListItemIcon>
                <ListItemText>Venda</ListItemText>
              </MenuItem>
              <MenuItem
                onClick={() => setOpenAddSupportRequest(!openAddSupportRequest)}
              >
                <ListItemIcon>
                  <SupportAgentIcon />
                </ListItemIcon>
                <ListItemText>Suporte</ListItemText>
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
            label="Jobs"
            sx={{ color: "#eee", "&.Mui-selected": { color: "black" } }}
          />
          <Tab
            label="Vendas"
            sx={{ color: "#eee", "&.Mui-selected": { color: "black" } }}
          />
          <Tab
            label="Suporte"
            sx={{ color: "#eee", "&.Mui-selected": { color: "black" } }}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <JobTable selectedCustomer={selectedCustomer} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <SaleTable selectedCustomer={selectedCustomer} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <SupportTable selectedCustomer={selectedCustomer} />
      </CustomTabPanel>
      {openAddJob && (
        <Dialog
          fullWidth
          maxWidth="lg"
          open={openAddJob}
          onClose={() => setOpenAddJob(!openAddJob)}
        >
          <AddJobForm
            openAddJob={openAddJob}
            setOpenAddJob={setOpenAddJob}
            customers={customers}
            departments={departments}
            services={services}
            latestJobNumber={latestJobNumber}
            fetchData={fetchData}
          />
        </Dialog>
      )}
      {/* {openAddSaleRequest && (
        <Dialog
          fullWidth
          maxWidth="md"
          open={openAddJobRequest}
          onClose={() => setOpenAddJobRequest(!openAddSaleRequest)}
        >
          <AddRequestSaleForm
            openAdd={openAddSaleRequest}
            setOpenAdd={openAddJobRequest}
            fetchData={fetchData}
          />
        </Dialog>
      )} */}
      {/* {openAddSupportRequest && (
        <Dialog
          fullWidth
          maxWidth="md"
          open={openAddSupportRequest}
          onClose={() => setOpenAddJobRequest(!openAddSupportRequest)}
        >
          <AddRequestSupportForm
            openAdd={openAddSupportRequest}
            setOpenAdd={openAddSupportRequest}
            fetchData={fetchData}
          />
        </Dialog>
      )} */}
    </Box>
  );
}
