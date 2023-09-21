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

import EngineeringIcon from "@mui/icons-material/Engineering";
import SellIcon from "@mui/icons-material/Sell";

import JobTable from "../tables/JobTable";
import SaleTable from "../tables/SaleTable";

import AddJobForm from "../forms/add/AddJobForm";
import AddSaleForm from "../forms/add/AddSaleForm";

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

export default function Requests() {
  const [value, setValue] = React.useState(0);

  const [openAddJob, setOpenAddJob] = React.useState(false);
  const [openAddSale, setOpenAddSale] = React.useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const openAddButton = Boolean(anchorEl);

  const [jobs, setJobs] = React.useState([]);
  const [supports, setSupports] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const jobs = await api.get("/jobs");
        setJobs(jobs.data.filter((job) => job.price !== 0));
        setSupports(jobs.data.filter((job) => job.price === 0));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [jobs]);

  const fetchData = async () => {
    try {
      const jobs = await api.get("/jobs");
      setJobs(jobs.data.filter((job) => job.price !== 0));
      setSupports(jobs.data.filter((job) => job.price === 0));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
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
            <MenuList sx={{ width: 200 }}>
              <MenuItem onClick={() => setOpenAddJob(!openAddJob)}>
                <ListItemIcon>
                  <EngineeringIcon />
                </ListItemIcon>
                <ListItemText>Job / Atendimento</ListItemText>
              </MenuItem>
              <MenuItem
                onClick={() => setOpenAddSale(!openAddSale)}
              >
                <ListItemIcon>
                  <SellIcon />
                </ListItemIcon>
                <ListItemText>Venda</ListItemText>
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
            label={<Typography sx={{ fontSize: 14 }}>Jobs</Typography>}
            sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
          />
          <Tab
            label={<Typography sx={{ fontSize: 14 }}>Vendas</Typography>}
            sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
          />
          <Tab
            label={<Typography sx={{ fontSize: 14 }}>Atendimentos</Typography>}
            sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <JobTable jobs={jobs} fetchData={fetchData} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <SaleTable />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <JobTable jobs={supports} fetchData={fetchData} />
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
            fetchData1={fetchData}
            toast={toast}
          />
        </Dialog>
      )}
      {openAddSale && (
        <Dialog
          fullWidth
          maxWidth="xs"
          open={openAddSale}
          onClose={() => setOpenAddSale(!openAddSale)}
        >
          <AddSaleForm
            openAdd={openAddSale}
            setOpenAdd={openAddSale}
            fetchData={fetchData}
          />
        </Dialog>
      )}
    </Box>
  );
}
