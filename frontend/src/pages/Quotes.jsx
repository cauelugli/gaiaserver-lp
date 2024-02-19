/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import { Box, Grid, Tab, Tabs, Typography } from "@mui/material";

import QuoteTable from "../tables/QuoteTable";

import TableFilters from "../components/TableFilters";
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

export default function Quotes({ user, configData }) {
  const [refreshData, setRefreshData] = React.useState(false);
  const [value, setValue] = React.useState(0);

  const [searchValue, setSearchValue] = React.useState("");
  const [searchOption, setSearchOption] = React.useState("number");
  const [searchOptionLabel, setSearchOptionLabel] = React.useState("Número");
  const searchOptionList = [
    {
      // JOB QUOTES TABLE
      options: [
        { value: "number", label: "Número" },
        { value: "service", label: "Serviço" },
        { value: "customer", label: "Cliente" },
        { value: "user", label: "Colaborador" },
        { value: "department", label: "Departamento" },
      ],
    },
    {
      // SALE QUOTES TABLE
      options: [
        { value: "number", label: "Número" },
        { value: "items", label: "Itens" },
        { value: "customer", label: "Cliente" },
        { value: "user", label: "Colaborador" },
        { value: "department", label: "Departamento" },
      ],
    },
  ];

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const [quotes, setQuotes] = React.useState([]);
  const [configCustomization, setConfigCustomization] = React.useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setSearchOption("number");
    setSearchValue("");
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const quotes = await api.get("/quotes");
        const configCustomization = await api.get("/config");
        setQuotes(quotes.data);
        setConfigCustomization(configCustomization.data[0].customization);
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
          Orçamentos
        </Typography>
      </Grid>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          TabIndicatorProps={{ style: { backgroundColor: "black" } }}
        >
          <Tab
            label={<Typography sx={{ fontSize: 13 }}>Jobs</Typography>}
            sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
          />
          <Tab
            label={<Typography sx={{ fontSize: 13 }}>Vendas</Typography>}
            sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
          />
          <RefreshButton
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            configCustomization={configCustomization}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {quotes.filter((quote) => quote.type === "job").length === 0 ? (
          <NoDataText option="Orçamentos de Jobs" />
        ) : (
          <>
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
            <QuoteTable
              quotes={quotes.filter((quote) => quote.type === "job")}
              config={configData}
              type={"job"}
              searchOption={searchOption}
              searchValue={searchValue}
              refreshData={refreshData}
              setRefreshData={setRefreshData}
            />
          </>
        )}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {quotes.filter((quote) => quote.type === "sale").length === 0 ? (
          <NoDataText option="Orçamentos de Vendas" />
        ) : (
          <>
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
            <QuoteTable
              quotes={quotes.filter((quote) => quote.type === "sale")}
              type={"sale"}
              config={configData}
              searchOption={searchOption}
              searchValue={searchValue}
              refreshData={refreshData}
              setRefreshData={setRefreshData}
            />
          </>
        )}
      </CustomTabPanel>
    </Box>
  );
}
