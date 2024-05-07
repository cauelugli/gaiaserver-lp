/* eslint-disable react/prop-types */
import React from "react";
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

import AddStockItemForm from "../forms/add/AddStockItemForm";
import AddStockProductForm from "../forms/add/AddStockProductForm";
import AddStockForm from "../forms/add/AddStockForm";
import AddProductForm from "../forms/add/AddProductForm";
import AddMultipleProductForm from "../forms/add/AddMultipleProductForm";

import StockTable from "../tables/StockTable";
import StockEntriesTable from "../tables/StockEntriesTable";
import ProductsTable from "../tables/ProductsTable";

import TableFilters from "../components/TableFilters";
import StockTableButton from "../components/small/buttons/tableButtons/StockTableButton";
import RefreshButton from "../components/small/buttons/RefreshButton";
import NoDataText from "../components/small/NoDataText";
import TableOrCardSelector from "../components/small/TableOrCardSelector";
import StockCard from "../components/cards/StockCard";

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

export default function Stock({
  userId,
  userName,
  userRole,
  userDepartment,
  configTables,
  topBar,
  tableOrCardView,
  setUserPreferences,
  cardSize,
}) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [refreshData, setRefreshData] = React.useState(false);
  const [configStock, setConfigStock] = React.useState(false);
  const [configCustomization, setConfigCustomization] = React.useState([]);
  const [value, setValue] = React.useState(0);

  const [stockItems, setStockItems] = React.useState([]);
  const [products, setProducts] = React.useState([]);
  const [stock, setStock] = React.useState([]);

  const [openModals, setOpenModals] = React.useState([
    false,
    false,
    false,
    false,
    false,
  ]);

  const [searchValue, setSearchValue] = React.useState("");
  const [searchOption, setSearchOption] = React.useState("name");
  const [searchOptionLabel, setSearchOptionLabel] = React.useState("Nome");
  const searchOptionList = [
    {
      // PRODUCTS TABLE
      options: [
        { value: "nome", label: "Name" },
        { value: "brand", label: "Marca" },
        { value: "type", label: "Tipo" },
        { value: "model", label: "Modelo" },
        { value: "size", label: "Tamanho" },
        { value: "buyValue", label: "Valor de Compra" },
        { value: "sellValue", label: "Valor de Venda" },
      ],
    },
    {
      // STOCK ITEMS TABLE
      options: [
        { value: "nome", label: "Name" },
        { value: "buyValue", label: "Valor de Compra" },
        { value: "sellValue", label: "Valor de Venda" },
      ],
    },
    {
      // STOCK ENTRIES TABLE
      options: [
        { value: "number", label: "Número" },
        { value: "items", label: "Itens" },
        { value: "createdBy", label: "Criado por" },
        { value: "quoteValue", label: "Valor" },
        { value: "createdAt", label: "Criado em" },
      ],
    },
  ];

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setSearchValue("");
    setSearchOption("name");
    setSearchOptionLabel("Nome");
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
        const stockEntries = await api.get("/stock");
        const config = await api.get("/config");
        setConfigStock(config.data[0].stock);
        setConfigCustomization(config.data[0].customization);
        setStockItems(stockItems.data);
        setProducts(products.data);
        setStock(stockEntries.data);
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
    <Box sx={{ minHeight: "50vw" }}>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        sx={{ m: 2 }}
      >
        <Typography sx={{ fontSize: 25, mr: 1, fontWeight: "bold" }}>
          Estoque
        </Typography>
        <StockTableButton
          openModal={openModal}
          configCustomization={configCustomization}
        />
      </Grid>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          TabIndicatorProps={{ style: { backgroundColor: "black" } }}
        >
          {configTables.stockProduct && (
            <Tab
              label={<Typography sx={{ fontSize: 13 }}>Produtos</Typography>}
              sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
            />
          )}
          {configTables.stockItems && (
            <Tab
              label={<Typography sx={{ fontSize: 13 }}>Materiais</Typography>}
              sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
            />
          )}
          <Tab
            label={<Typography sx={{ fontSize: 13 }}>Entradas</Typography>}
            sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
          />
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
      {configTables.stockProduct && (
        <CustomTabPanel value={value} index={0}>
          {products.length === 0 ? (
            <NoDataText option="Produtos" />
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
                <ProductsTable
                  products={products}
                  searchValue={searchValue}
                  searchOption={searchOption}
                  refreshData={refreshData}
                  setRefreshData={setRefreshData}
                  topBar={topBar}
                />
              ) : (
                <Grid
                  sx={{ mt: 0.5, width: topBar ? "107%" : "100%" }}
                  container
                  spacing={2}
                >
                  {products.map((product, index) => (
                    <Grid
                      item
                      key={index}
                      md={cardSize}
                      lg={cardSize}
                      xl={cardSize}
                    >
                      <StockCard
                        item={product}
                        type="product"
                        refreshData={refreshData}
                        setRefreshData={setRefreshData}
                      />
                    </Grid>
                  ))}
                </Grid>
              )}
            </>
          )}
        </CustomTabPanel>
      )}
      {configTables.stockItems && (
        <CustomTabPanel value={value} index={configTables.stockProduct ? 1 : 0}>
          {stockItems.length === 0 ? (
            <NoDataText option="Items de Estoque" />
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
                <StockTable
                  stockItems={stockItems}
                  searchValue={searchValue}
                  searchOption={searchOption}
                  refreshData={refreshData}
                  setRefreshData={setRefreshData}
                  topBar={topBar}
                />
              ) : (
                <Grid
                  sx={{ mt: 0.5, width: topBar ? "107%" : "100%" }}
                  container
                  spacing={2}
                >
                  {stockItems.map((item, index) => (
                    <Grid
                      item
                      key={index}
                      md={cardSize}
                      lg={cardSize}
                      xl={cardSize}
                    >
                      <StockCard
                        item={item}
                        type="material"
                        refreshData={refreshData}
                        setRefreshData={setRefreshData}
                      />
                    </Grid>
                  ))}
                </Grid>
              )}
            </>
          )}
        </CustomTabPanel>
      )}
      <CustomTabPanel
        value={value}
        index={
          configTables.stockProduct && configTables.stockItems
            ? 2
            : !configTables.stockProduct && !configTables.stockItems
            ? 0
            : 1
        }
      >
        {stock.length === 0 ? (
          <NoDataText option="Entradas de Estoque" femaleGender={true} />
        ) : (
          <>
            {tableOrCardView && (
              <TableFilters
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                searchOption={searchOption}
                searchOptionList={searchOptionList[2]}
                setSearchOption={setSearchOption}
                searchOptionLabel={searchOptionLabel}
                setSearchOptionLabel={setSearchOptionLabel}
                handleSearchChange={handleSearchChange}
              />
            )}
            {tableOrCardView ? (
              <StockEntriesTable
                stockEntries={stock}
                userName={userName}
                userRole={userRole}
                userDepartment={userDepartment}
                configData={configStock}
                searchValue={searchValue}
                searchOption={searchOption}
                refreshData={refreshData}
                setRefreshData={setRefreshData}
                topBar={topBar}
              />
            ) : (
              <Grid
                sx={{ mt: 0.5, width: topBar ? "107%" : "100%" }}
                container
                spacing={2}
              >
                {stock.map((item, index) => (
                  <Grid
                    item
                    key={index}
                    md={cardSize}
                    lg={cardSize}
                    xl={cardSize}
                  >
                    <StockCard
                      item={item}
                      type="entry"
                      refreshData={refreshData}
                      setRefreshData={setRefreshData}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
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
            userName={userName}
            onClose={() => closeModal(0)}
            refreshData={refreshData}
            configCustomization={configCustomization}
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
            userName={userName}
            onClose={() => closeModal(1)}
            refreshData={refreshData}
            configCustomization={configCustomization}
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
            userName={userName}
            onClose={() => closeModal(2)}
            refreshData={refreshData}
            configCustomization={configCustomization}
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
            userName={userName}
            userDepartment={userDepartment}
            configData={configStock}
            configCustomization={configCustomization}
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
            userName={userName}
            configData={configStock}
            stockItems={stockItems}
            onClose={() => closeModal(4)}
            refreshData={refreshData}
            configCustomization={configCustomization}
            setRefreshData={setRefreshData}
            toast={toast}
          />
        </Dialog>
      )}
    </Box>
  );
}
