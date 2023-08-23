/* eslint-disable react/prop-types */
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

import AddRequestForm from "../forms/add/AddRequestForm";
import SaleTable from "../tables/SaleTable";
import SupportTable from "../tables/SupportTable";

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

export default function Requests({ selectedCustomer }) {
  const [value, setValue] = React.useState(0);

  const [requests, setRequests] = React.useState([]);
  const [filteredJobs, setFilteredJobs] = React.useState([]);
  const [filteredSales, setFilteredSales] = React.useState([]);
  const [filteredSupports, setFilteredSupports] = React.useState([]);

  const [openAddRequest, setOpenAddRequest] = React.useState(false);
  const [option, setOption] = React.useState("false");

  const [anchorEl, setAnchorEl] = React.useState(null);
  const openAddButton = Boolean(anchorEl);

  const handleClickAddMenu = (option) => {
    setOpenAddRequest(!openAddRequest);
    setOption(option);
  };

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
        const response = await api.get("/requests");
        const filteredRequests = response.data.filter(
          (request) => request.customerId === selectedCustomer._id
        );
        const filteredJobs = filteredRequests.filter(
          (job) => job.type === "Job"
        );
        const filteredSales = filteredRequests.filter(
          (sale) => sale.type === "Venda"
        );
        const filteredSupports = filteredRequests.filter(
          (support) => support.type === "Suporte"
        );
        setRequests(filteredRequests);
        setFilteredJobs(filteredJobs);
        setFilteredSales(filteredSales);
        setFilteredSupports(filteredSupports);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [selectedCustomer._id, requests]);

  const fetchData = async () => {
    try {
      const response = await api.get("/requests");
      const filteredRequests = response.data.filter(
        (request) => request.customerId === selectedCustomer._id
      );
      const filteredJobs = filteredRequests.filter((job) => job.type === "Job");
      const filteredSales = filteredRequests.filter(
        (sale) => sale.type === "Venda"
      );
      const filteredSupports = filteredRequests.filter(
        (support) => support.type === "Suporte"
      );
      setRequests(filteredRequests);
      setFilteredJobs(filteredJobs);
      setFilteredSales(filteredSales);
      setFilteredSupports(filteredSupports);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
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
              <MenuItem onClick={() => handleClickAddMenu("Job")}>
                <ListItemIcon>
                  <EngineeringIcon />
                </ListItemIcon>
                <ListItemText>Job</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => handleClickAddMenu("Sale")}>
                <ListItemIcon>
                  <SellIcon />
                </ListItemIcon>
                <ListItemText>Venda</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => handleClickAddMenu("Support")}>
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
        <JobTable
          selectedCustomer={selectedCustomer}
          filteredJobs={filteredJobs}
          fetchData={fetchData}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <SaleTable
          selectedCustomer={selectedCustomer}
          filteredSales={filteredSales}
          fetchData={fetchData}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <SupportTable
          selectedCustomer={selectedCustomer}
          filteredSupports={filteredSupports}
          fetchData={fetchData}
        />
      </CustomTabPanel>
      {openAddRequest && (
        <Dialog
          fullWidth
          maxWidth="md"
          open={openAddRequest}
          onClose={() => setOpenAddRequest(!openAddRequest)}
        >
          <AddRequestForm
            openAdd={openAddRequest}
            selectedCustomer={selectedCustomer}
            setOpenAdd={setOpenAddRequest}
            option={option}
            fetchData={fetchData}
          />
        </Dialog>
      )}
    </Box>
  );
}
