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
  FormHelperText,
  Grid,
  InputAdornment,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Radio,
  RadioGroup,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";

import EngineeringIcon from "@mui/icons-material/Engineering";
import SellIcon from "@mui/icons-material/Sell";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

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

export default function Requests({ user }) {
  const [refreshData, setRefreshData] = React.useState(false);
  const [value, setValue] = React.useState(0);

  const [openAddJob, setOpenAddJob] = React.useState(false);
  const [openAddSale, setOpenAddSale] = React.useState(false);

  const [searchValue, setSearchValue] = React.useState("");
  const [searchOption, setSearchOption] = React.useState("requester");
  const [searchOptionLabel, setSearchOptionLabel] =
    React.useState("Solicitante");

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
  const [managers, setManagers] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const jobs = await api.get("/jobs");
        const sales = await api.get("/sales");
        const managers = await api.get("/managers");
        setJobs(jobs.data);
        setSales(sales.data);
        setManagers(managers.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [refreshData]);

  const fetchData = async () => {
    try {
      const jobs = await api.get("/jobs");
      const sales = await api.get("/sales");
      const managers = await api.get("/managers");
      setJobs(jobs.data);
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
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
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
            >
              <MenuItem value="status">Status</MenuItem>
              <MenuItem value="requester">Solicitante</MenuItem>
              <MenuItem value="createdBy">Criado por</MenuItem>
              <MenuItem value="worker.name">Designado</MenuItem>
              <MenuItem value="scheduledTo">Data de Agendamento</MenuItem>
            </Select>
            <FormHelperText>Filtrar por</FormHelperText>
          </Grid>
          <Grid item sx={{ ml: "3%" }}>
            {searchOption === "status" && (
              <>
                <Select
                  onChange={(e) => setSearchValue(e.target.value)}
                  size="small"
                  placeholder="Selecione"
                  sx={{ minWidth: 110 }}
                >
                  <MenuItem value={"Aberto"}>Aberto</MenuItem>
                  <MenuItem value={"Aprovado"}>Aprovado</MenuItem>
                  <MenuItem value={"Aguardando Execução"}>
                    Aguardando Execução
                  </MenuItem>
                  <MenuItem value={"Em Execução"}>Em Execução</MenuItem>
                  <MenuItem value={"Aguardando Cliente"}>
                    Aguardando Cliente
                  </MenuItem>
                  <MenuItem value={"Aguardando Terceiro"}>
                    Aguardando Terceiro
                  </MenuItem>
                  <MenuItem value={"Concluido"}>Concluido</MenuItem>
                </Select>
                <FormHelperText>Selecione o Status</FormHelperText>
              </>
            )}
          </Grid>
        </Grid>

        <JobTable
          user={user}
          searchValue={searchValue}
          searchOption={searchOption}
          jobs={jobs}
          managers={managers}
          refreshData={refreshData}
          setRefreshData={setRefreshData}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
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
            >
              <MenuItem value="status">Status</MenuItem>
              <MenuItem value="requester">Comprador</MenuItem>
              <MenuItem value="createdBy">Criado por</MenuItem>
              <MenuItem value="seller.name">Vendedor</MenuItem>
              <MenuItem value="deliveryScheduledTo">Data de Entrega</MenuItem>
            </Select>
            <FormHelperText>Filtrar por</FormHelperText>
          </Grid>
          <Grid item sx={{ ml: "3%" }}>
            {searchOption === "status" && (
              <>
                <Select
                  onChange={(e) => setSearchValue(e.target.value)}
                  size="small"
                  placeholder="Selecione"
                  sx={{ minWidth: 110 }}
                >
                  <MenuItem value={"Aberto"}>Aberto</MenuItem>
                  <MenuItem value={"Autorizado"}>Autorizado</MenuItem>
                  <MenuItem value={"Aguardando Despacho"}>
                    Aguardando Despacho
                  </MenuItem>
                  <MenuItem value={"Em Trânsito"}>Em Trânsito</MenuItem>
                  <MenuItem value={"Aguardando Cliente"}>
                    Aguardando Cliente
                  </MenuItem>
                  <MenuItem value={"Aguardando Terceiro"}>
                    Aguardando Terceiro
                  </MenuItem>
                  <MenuItem value={"Concluido"}>Concluido</MenuItem>
                </Select>
                <FormHelperText>Selecione o Status</FormHelperText>
              </>
            )}
          </Grid>
        </Grid>

        <SaleTable
          searchValue={searchValue}
          searchOption={searchOption}
          sales={sales}
          managers={managers}
          refreshData={refreshData}
          setRefreshData={setRefreshData}
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
            user={user}
            openAddJob={openAddJob}
            setOpenAddJob={setOpenAddJob}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
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
            user={user}
            openAddSale={openAddSale}
            setOpenAddSale={setOpenAddSale}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            toast={toast}
          />
        </Dialog>
      )}
    </Box>
  );
}
