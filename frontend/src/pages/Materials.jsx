/* eslint-disable react/prop-types */
import React from "react";
// import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import {
  Box,
  CircularProgress,
  Grid,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

import StockEntriesTable from "../tables/StockEntriesTable";

import TableFilters from "../components/TableFilters";
import MaterialsTableButton from "../components/small/buttons/tableButtons/MaterialsTableButton";
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

export default function Materials({
  userId,
  userName,
  userRole,
  userDepartment,
  configData,
  topBar,
  tableOrCardView,
  setUserPreferences,
  cardSize,
}) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [refreshData, setRefreshData] = React.useState(false);
  const [newDataRefreshButton, setNewDataRefreshButton] = React.useState(true);
  const [configStock, setConfigStock] = React.useState(false);
  const [configCustomization, setConfigCustomization] = React.useState([]);
  const [value, setValue] = React.useState(0);

  const [stockItems, setStockItems] = React.useState([]);

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

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const stockItems = await api.get("/stockItems");
        const config = await api.get("/config");
        setConfigStock(config.data[0].stock);
        setConfigCustomization(config.data[0].customization);
        setStockItems(stockItems.data);
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
          Materiais
        </Typography>
        <MaterialsTableButton configCustomization={configCustomization} />
      </Grid>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          TabIndicatorProps={{ style: { backgroundColor: "black" } }}
        >
          <Tab
            label={<Typography sx={{ fontSize: 13 }}>Materiais</Typography>}
            sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
          />
          <RefreshButton
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            configCustomization={configCustomization}
            userId={userId}
            newDataRefreshButton={newDataRefreshButton}
            setNewDataRefreshButton={setNewDataRefreshButton}
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
      <CustomTabPanel value={value} index={0}>
        {stockItems.length === 0 ? (
          <NoDataText option="Materiais" />
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
                // stockEntries={stock}
                userName={userName}
                userId={userId}
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
                {stockItems.map((item, index) => (
                  <Grid
                    item
                    key={index}
                    md={cardSize}
                    lg={cardSize}
                    xl={cardSize}
                  >
                    <StockCard
                      userId={userId}
                      userName={userName}
                      configData={configData}
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
    </Box>
  );
}
