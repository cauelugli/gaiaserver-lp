/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import * as React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  Grid,
  InputAdornment,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";

import NoDataText from "../components/small/NoDataText";
import RefreshButton from "../components/small/buttons/RefreshButton";
import TableFilters from "../components/TableFilters";
import FinanceIncomeTable from "../tables/FinanceIncomeTable";
import FinanceOutcomeTable from "../tables/FinanceOutcomeTable";
import TableOrCardSelector from "../components/small/TableOrCardSelector";
import FinanceCard from "../components/cards/FinanceCard";

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

export default function Finance({
  userId,
  topBar,
  setUserPreferences,
  tableOrCardView,
  cardSize,
}) {
  const [isLoading, setIsLoading] = React.useState(true);

  const [refreshData, setRefreshData] = React.useState(false);
  const [newDataRefreshButton, setNewDataRefreshButton] = React.useState(true);
  const [value, setValue] = React.useState(0);
  const [configData, setConfigData] = React.useState([]);
  const [configCustomization, setConfigCustomization] = React.useState([]);
  const [incoming, setIncoming] = React.useState([]);
  const [outcoming, setOutcoming] = React.useState([]);

  const [searchOption, setSearchOption] = React.useState("quote");
  const [searchOptionLabel, setSearchOptionLabel] = React.useState("Orçamento");
  const [searchValue, setSearchValue] = React.useState("");

  const searchOptionList = [
    {
      // FINANCE INCOME TABLE
      options: [{ value: "quote", label: "Orçamento" }],
    },
    {
      // FINANCE OUTCOME TABLE
      options: [{ value: "type", label: "Tipo" }],
    },
  ];

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setSearchValue("");
    newValue === 0
      ? (setSearchOption("quote"), setSearchOptionLabel("Orçamento"))
      : (setSearchOption("type"), setSearchOptionLabel("Tipo"));
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const incomes = await api.get("/finances/income");
        const outcomes = await api.get("/finances/outcome");
        const config = await api.get("/config");
        setConfigData(config.data[0].finance);
        setConfigCustomization(config.data[0].customization);
        setIncoming(incomes.data);
        setOutcoming(outcomes.data);
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
      <Typography sx={{ fontSize: 25, m: 2, fontWeight: "bold" }}>
        Financeiro
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          TabIndicatorProps={{ style: { backgroundColor: "black" } }}
        >
          <Tab
            label={<Typography sx={{ fontSize: 13 }}>A Receber</Typography>}
            sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
          />
          <Tab
            label={<Typography sx={{ fontSize: 13 }}>A Pagar</Typography>}
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
        {incoming.length === 0 ? (
          <NoDataText option="Contas a Receber" femaleGender={true} />
        ) : (
          <>
            {tableOrCardView && (
              <TableFilters
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                searchOption={"quote"}
                searchOptionList={searchOptionList[0]}
                setSearchOption={setSearchOption}
                searchOptionLabel={searchOptionLabel}
                setSearchOptionLabel={setSearchOptionLabel}
                handleSearchChange={handleSearchChange}
              />
            )}
            {tableOrCardView ? (
              <FinanceIncomeTable
                incoming={incoming}
                configCustomization={configCustomization}
                configData={configData}
                refreshData={refreshData}
                setRefreshData={setRefreshData}
                toast={toast}
                searchValue={searchValue}
                searchOption={searchOption}
                topBar={topBar}
              />
            ) : (
              <Grid
                sx={{ mt: 0.5, width: topBar ? "107%" : "100%" }}
                container
                spacing={2}
              >
                {incoming.map((item, index) => (
                  <Grid
                    item
                    key={index}
                    md={cardSize}
                    lg={cardSize}
                    xl={cardSize}
                  >
                    <FinanceCard
                      item={item}
                      type="income"
                      refreshData={refreshData}
                      setRefreshData={setRefreshData}
                      configData={configData}
                      configCustomization={configCustomization}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
      </CustomTabPanel>

      <CustomTabPanel value={value} index={1}>
        {outcoming.length === 0 ? (
          <NoDataText option="Contas a Pagar" femaleGender={true} />
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
              <FinanceOutcomeTable
                outcoming={outcoming}
                configData={configData}
                configCustomization={configCustomization}
                refreshData={refreshData}
                setRefreshData={setRefreshData}
                toast={toast}
                searchValue={searchValue}
                searchOption={searchOption}
                topBar={topBar}
              />
            ) : (
              <Grid
                sx={{ mt: 0.5, width: topBar ? "107%" : "100%" }}
                container
                spacing={2}
              >
                {outcoming.map((item, index) => (
                  <Grid
                    item
                    key={index}
                    md={cardSize}
                    lg={cardSize}
                    xl={cardSize}
                  >
                    <FinanceCard
                      item={item}
                      type="outcome"
                      refreshData={refreshData}
                      setRefreshData={setRefreshData}
                      configData={configData}
                      configCustomization={configCustomization}
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
