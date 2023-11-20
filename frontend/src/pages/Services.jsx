/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
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

import BuildIcon from "@mui/icons-material/Build";
import ClearIcon from "@mui/icons-material/Clear";
import HubIcon from "@mui/icons-material/Hub";
import SearchIcon from "@mui/icons-material/Search";

import ServiceTable from "../tables/ServiceTable";
import AddServiceForm from "../forms/add/AddServiceForm";
import ServicePlansTable from "../tables/ServicePlansTable";
import AddServicePlanForm from "../forms/add/AddServicePlanForm";
import RefreshButton from "../components/small/buttons/RefreshButton";
import NoDataText from "../components/small/NoDataText";

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

export default function Services({ user }) {
  const [refreshData, setRefreshData] = React.useState(false);
  const [value, setValue] = React.useState(0);
  const [openAddService, setOpenAddService] = React.useState(false);
  const [openAddServicePlan, setOpenAddServicePlan] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const [searchOption, setSearchOption] = React.useState("name");

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSearchOptionChange = (event) => {
    setSearchOption(event.target.value);
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
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const services = await api.get("/services");
        const servicePlans = await api.get("/servicePlans");
        const departments = await api.get("/departments");
        const stockItems = await api.get("/stockItems");
        setServices(services.data.filter((service) => service.value > 0));
        setSupports(services.data.filter((service) => service.value === 0));
        setServicePlans(servicePlans.data);
        setDepartments(departments.data);
        setStockItems(stockItems.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [refreshData]);

  const fetchData = async () => {
    try {
      const services = await api.get("/services");
      const servicePlans = await api.get("/servicePlans");
      const departments = await api.get("/departments");
      const stockItems = await api.get("/stockItems");
      setServices(services.data.filter((service) => service.value > 0));
      setSupports(services.data.filter((service) => service.value === 0));
      setServicePlans(servicePlans.data);
      setDepartments(departments.data);
      setStockItems(stockItems.data);
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
          Serviços
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
            <MenuList sx={{ width: 195 }}>
              <MenuItem onClick={() => setOpenAddService(true)}>
                <ListItemIcon>
                  <BuildIcon />
                </ListItemIcon>
                <ListItemText>Serviço</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => setOpenAddServicePlan(true)}>
                <ListItemIcon>
                  <HubIcon />
                </ListItemIcon>
                <ListItemText>Plano de Serviço</ListItemText>
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
            label={<Typography sx={{ fontSize: 14 }}>Setores</Typography>}
            sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
          />
          <Tab
            label={<Typography sx={{ fontSize: 14 }}>Consultoria</Typography>}
            sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
          />
          <Tab
            label={<Typography sx={{ fontSize: 14 }}>Planos</Typography>}
            sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
          />
          <RefreshButton
            refreshData={refreshData}
            setRefreshData={setRefreshData}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {services.length === 0 ? (
          <NoDataText option="Serviços" />
        ) : (
          <>
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
                    value="name"
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
                </RadioGroup>
              </Grid>
            </Grid>
            <ServiceTable
              searchOption={searchOption}
              searchValue={searchValue}
              services={services}
              departments={departments}
              stockItems={stockItems}
              refreshData={refreshData}
              setRefreshData={setRefreshData}
            />
          </>
        )}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {supports.length === 0 ? (
          <NoDataText option="Serviços de Consultoria" />
        ) : (
          <>
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
                    value="name"
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
                </RadioGroup>
              </Grid>
            </Grid>
            <ServiceTable
              searchOption={searchOption}
              searchValue={searchValue}
              services={supports}
              departments={departments}
              stockItems={stockItems}
              refreshData={refreshData}
              setRefreshData={setRefreshData}
            />
          </>
        )}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        {servicePlans.length === 0 ? (
          <NoDataText option="Planos de Serviços" />
        ) : (
          <>
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
                    value="name"
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
                </RadioGroup>
              </Grid>
            </Grid>
            <ServicePlansTable
              searchOption={searchOption}
              searchValue={searchValue}
              servicePlans={servicePlans}
              refreshData={refreshData}
              setRefreshData={setRefreshData}
            />
          </>
        )}
      </CustomTabPanel>
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
