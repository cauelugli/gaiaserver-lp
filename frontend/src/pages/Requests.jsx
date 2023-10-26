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
  FormControlLabel,
  Grid,
  InputAdornment,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Radio,
  RadioGroup,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";

import EngineeringIcon from "@mui/icons-material/Engineering";
import SellIcon from "@mui/icons-material/Sell";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";

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

  const [searchValue, setSearchValue] = React.useState("");
  const [searchOption, setSearchOption] = React.useState("requester");

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSearchOptionChange = (event) => {
    setSearchOption(event.target.value);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const openAddButton = Boolean(anchorEl);

  const [jobs, setJobs] = React.useState([]);
  const [sales, setSales] = React.useState([]);
  const [supports, setSupports] = React.useState([]);
  const [managers, setManagers] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const jobs = await api.get("/jobs");
        const sales = await api.get("/sales");
        const managers = await api.get("/managers");
        setJobs(jobs.data.filter((job) => job.price !== 0));
        setSupports(jobs.data.filter((job) => job.price === 0));
        setSales(sales.data);
        setManagers(managers.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [jobs]);

  const fetchData = async () => {
    try {
      const jobs = await api.get("/jobs");
      const sales = await api.get("/sales");
      const managers = await api.get("/managers");
      setJobs(jobs.data.filter((job) => job.price !== 0));
      setSupports(jobs.data.filter((job) => job.price === 0));
      setSales(sales.data);
      setManagers(managers.data);
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
    setSearchValue("");
    setSearchOption("requester");
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
              <MenuItem onClick={() => setOpenAddSale(!openAddSale)}>
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
        <Grid container direction="row" justifyContent="flex-start">
          <Grid item>
            <TextField
              placeholder="Pesquise aqui..."
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
          <Grid item sx={{ ml: "2%", pt: 0.5 }}>
            <RadioGroup
              row
              value={searchOption}
              onChange={handleSearchOptionChange}
            >
              <FormControlLabel
                value="title"
                control={
                  <Radio
                    sx={{
                      "& .MuiSvgIcon-root": {
                        fontSize: 13,
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: 13, mx: -1, mt: 0.5 }}>
                    Nome
                  </Typography>
                }
              />
              <FormControlLabel
                value="requester"
                control={
                  <Radio
                    sx={{
                      "& .MuiSvgIcon-root": {
                        fontSize: 13,
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: 13, mx: -1, mt: 0.5 }}>
                    Solicitante
                  </Typography>
                }
              />

              <FormControlLabel
                value="worker.name"
                control={
                  <Radio
                    sx={{
                      "& .MuiSvgIcon-root": {
                        fontSize: 13,
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: 13, mx: -1, mt: 0.5 }}>
                    Designado
                  </Typography>
                }
              />
              <FormControlLabel
                value="scheduledTo"
                control={
                  <Radio
                    sx={{
                      "& .MuiSvgIcon-root": {
                        fontSize: 13,
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: 13, mx: -1, mt: 0.5 }}>
                    Data
                  </Typography>
                }
              />
              <FormControlLabel
                value="status"
                control={
                  <Radio
                    sx={{
                      "& .MuiSvgIcon-root": {
                        fontSize: 13,
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: 13, mx: -1, mt: 0.5 }}>
                    Status
                  </Typography>
                }
              />
            </RadioGroup>
          </Grid>
        </Grid>

        <JobTable
          searchValue={searchValue}
          searchOption={searchOption}
          jobs={jobs}
          managers={managers}
          fetchData={fetchData}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Grid container direction="row" justifyContent="flex-start">
          <Grid item>
            <TextField
              placeholder="Pesquise aqui..."
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
          <Grid item sx={{ ml: "2%", pt: 0.5 }}>
            <RadioGroup
              row
              value={searchOption}
              onChange={handleSearchOptionChange}
            >
              <FormControlLabel
                value="requester"
                control={
                  <Radio
                    sx={{
                      "& .MuiSvgIcon-root": {
                        fontSize: 13,
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: 13, mx: -1, mt: 0.5 }}>
                    Comprador
                  </Typography>
                }
              />
              <FormControlLabel
                value="seller.name"
                control={
                  <Radio
                    sx={{
                      "& .MuiSvgIcon-root": {
                        fontSize: 13,
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: 13, mx: -1, mt: 0.5 }}>
                    Vendedor
                  </Typography>
                }
              />
              <FormControlLabel
                value="deliveryScheduledTo"
                control={
                  <Radio
                    sx={{
                      "& .MuiSvgIcon-root": {
                        fontSize: 13,
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: 13, mx: -1, mt: 0.5 }}>
                    Data
                  </Typography>
                }
              />
              <FormControlLabel
                value="status"
                control={
                  <Radio
                    sx={{
                      "& .MuiSvgIcon-root": {
                        fontSize: 13,
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: 13, mx: -1, mt: 0.5 }}>
                    Status
                  </Typography>
                }
              />
            </RadioGroup>
          </Grid>
        </Grid>

        <SaleTable
          searchValue={searchValue}
          searchOption={searchOption}
          sales={sales}
          managers={managers}
          fetchData={fetchData}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <Grid container direction="row" justifyContent="flex-start">
          <Grid item>
            <TextField
              placeholder="Pesquise aqui..."
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
          <Grid item sx={{ ml: "2%", pt: 0.5 }}>
            <RadioGroup
              row
              value={searchOption}
              onChange={handleSearchOptionChange}
            >
              <FormControlLabel
                value="title"
                control={
                  <Radio
                    sx={{
                      "& .MuiSvgIcon-root": {
                        fontSize: 13,
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: 13, mx: -1, mt: 0.5 }}>
                    Nome
                  </Typography>
                }
              />
              <FormControlLabel
                value="requester"
                control={
                  <Radio
                    sx={{
                      "& .MuiSvgIcon-root": {
                        fontSize: 13,
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: 13, mx: -1, mt: 0.5 }}>
                    Solicitante
                  </Typography>
                }
              />

              <FormControlLabel
                value="worker.name"
                control={
                  <Radio
                    sx={{
                      "& .MuiSvgIcon-root": {
                        fontSize: 13,
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: 13, mx: -1, mt: 0.5 }}>
                    Designado
                  </Typography>
                }
              />
              <FormControlLabel
                value="scheduledTo"
                control={
                  <Radio
                    sx={{
                      "& .MuiSvgIcon-root": {
                        fontSize: 13,
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: 13, mx: -1, mt: 0.5 }}>
                    Data
                  </Typography>
                }
              />
              <FormControlLabel
                value="status"
                control={
                  <Radio
                    sx={{
                      "& .MuiSvgIcon-root": {
                        fontSize: 13,
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: 13, mx: -1, mt: 0.5 }}>
                    Status
                  </Typography>
                }
              />
            </RadioGroup>
          </Grid>
        </Grid>

        <JobTable
          searchValue={searchValue}
          searchOption={searchOption}
          jobs={supports}
          fetchData={fetchData}
        />
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
          maxWidth="md"
          open={openAddSale}
          onClose={() => setOpenAddSale(!openAddSale)}
        >
          <AddSaleForm
            openAddSale={openAddSale}
            setOpenAddSale={setOpenAddSale}
            fetchData1={fetchData}
            toast={toast}
          />
        </Dialog>
      )}
    </Box>
  );
}
