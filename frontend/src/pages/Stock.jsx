/* eslint-disable react/prop-types */
import React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import {
  Box,
  Dialog,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

import AddStockItemForm from "../forms/add/AddStockItemForm";
import AddStockProductForm from "../forms/add/AddStockProductForm";
import AddStockForm from "../forms/add/AddStockForm";
import AddProductForm from "../forms/add/AddProductForm";
import AddMultipleProductForm from "../forms/add/AddMultipleProductForm";

import StockTable from "../tables/StockTable";
import StockEntriesTable from "../tables/StockEntriesTable";
import ProductsTable from "../tables/ProductsTable";

import StockButton from "../components/small/buttons/StockButton";
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

export default function Stock({ user }) {
  const [refreshData, setRefreshData] = React.useState(false);
  const [value, setValue] = React.useState(0);
  const [stockItems, setStockItems] = React.useState([]);
  const [products, setProducts] = React.useState([]);
  const [stockEntries, setStockEntries] = React.useState([]);

  const [openModals, setOpenModals] = React.useState([
    false,
    false,
    false,
    false,
    false,
  ]);

  const [searchValue, setSearchValue] = React.useState("");
  const [searchOption, setSearchOption] = React.useState("name");
  const [searchOptionLabel, setSearchOptionLabel] = React.useState("");

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setSearchValue("");
    setSearchOption("");
    setSearchOptionLabel("");
  };

  const openModal = (modalIndex) => {
    const updatedModals = [...openModals];
    updatedModals[modalIndex] = true;
    setOpenModals(updatedModals);
  };

  const closeModal = (modalIndex) => {
    const updatedModals = [...openModals];
    updatedModals[modalIndex] = false;
    setOpenModals(updatedModals);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const stockItems = await api.get("/stockItems");
        const products = await api.get("/products");
        const stockEntries = await api.get("/stockEntries");
        setStockItems(stockItems.data);
        setProducts(products.data);
        setStockEntries(stockEntries.data);
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
          Estoque
        </Typography>
        <StockButton openModal={openModal} />
      </Grid>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          TabIndicatorProps={{ style: { backgroundColor: "black" } }}
        >
          <Tab
            label={<Typography sx={{ fontSize: 14 }}>Produtos</Typography>}
            sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
          />
          <Tab
            label={<Typography sx={{ fontSize: 14 }}>Materiais</Typography>}
            sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
          />
          <Tab
            label={<Typography sx={{ fontSize: 14 }}>Entradas</Typography>}
            sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
          />
          <RefreshButton
            refreshData={refreshData}
            setRefreshData={setRefreshData}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {products.length === 0 ? (
          <NoDataText option="Produtos" />
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
                  <MenuItem value="brand">Marca</MenuItem>
                  <MenuItem value="type">Tipo</MenuItem>
                  <MenuItem value="model">Modelo</MenuItem>
                </Select>
              </Grid>
            </Grid>

            <ProductsTable
              searchValue={searchValue}
              searchOption={searchOption}
              refreshData={refreshData}
              setRefreshData={setRefreshData}
            />
          </>
        )}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {stockItems.length === 0 ? (
          <NoDataText option="Items de Estoque" />
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
                </Select>
              </Grid>
            </Grid>
            <StockTable
              stockItems={stockItems}
              searchValue={searchValue}
              searchOption={searchOption}
              refreshData={refreshData}
              setRefreshData={setRefreshData}
            />
          </>
        )}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        {stockEntries.length === 0 ? (
          <NoDataText option="Entradas de Estoque" />
        ) : (
          <>
            ZZ
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
                  <MenuItem value="quoteValue">Valor dos Itens</MenuItem>
                  <MenuItem value="createdBy">Criado por</MenuItem>
                  <MenuItem value="createdAt">Adicionado em</MenuItem>
                </Select>
              </Grid>
            </Grid>
            <StockEntriesTable
              searchValue={searchValue}
              searchOption={searchOption}
              refreshData={refreshData}
              setRefreshData={setRefreshData}
            />
          </>
        )}
      </CustomTabPanel>

      {openModals[0] && (
        <Dialog
          fullWidth
          maxWidth="lg"
          open={openModals[0]}
          onClose={() => closeModal(0)}
        >
          <AddProductForm
            user={user}
            onClose={() => closeModal(0)}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            toast={toast}
          />
        </Dialog>
      )}

      {openModals[1] && (
        <Dialog
          fullWidth
          maxWidth="lg"
          open={openModals[1]}
          onClose={() => closeModal(1)}
        >
          <AddMultipleProductForm
            user={user}
            onClose={() => closeModal(1)}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            toast={toast}
          />
        </Dialog>
      )}

      {openModals[2] && (
        <Dialog
          fullWidth
          maxWidth="sm"
          open={openModals[2]}
          onClose={() => closeModal(2)}
        >
          <AddStockItemForm
            user={user}
            onClose={() => closeModal(2)}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            toast={toast}
          />
        </Dialog>
      )}

      {openModals[3] && (
        <Dialog
          fullWidth
          maxWidth="lg"
          open={openModals[3]}
          onClose={() => closeModal(3)}
        >
          <AddStockProductForm
            user={user}
            products={products}
            onClose={() => closeModal(3)}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            toast={toast}
          />
        </Dialog>
      )}

      {openModals[4] && (
        <Dialog
          fullWidth
          maxWidth="lg"
          open={openModals[4]}
          onClose={() => closeModal(4)}
        >
          <AddStockForm
            user={user}
            stockItems={stockItems}
            onClose={() => closeModal(4)}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            toast={toast}
          />
        </Dialog>
      )}
    </Box>
  );
}
