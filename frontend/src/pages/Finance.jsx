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

export default function Finance({ user }) {
  const [isLoading, setIsLoading] = React.useState(true);

  const [refreshData, setRefreshData] = React.useState(false);
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
          Financeiro
        </Typography>
      </Grid>
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
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {incoming.length === 0 ? (
          <NoDataText option="Contas a Receber" femaleGender={true} />
        ) : (
          <>
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

            <FinanceIncomeTable
              incoming={incoming}
              configCustomization={configCustomization}
              configData={configData}
              refreshData={refreshData}
              setRefreshData={setRefreshData}
              toast={toast}
              searchValue={searchValue}
              searchOption={searchOption}
            />
          </>
        )}
      </CustomTabPanel>

      <CustomTabPanel value={value} index={1}>
        {outcoming.length === 0 ? (
          <NoDataText option="Contas a Pagar" femaleGender={true} />
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

            <FinanceOutcomeTable
              outcoming={outcoming}
              configData={configData}
              user={user}
              configCustomization={configCustomization}
              refreshData={refreshData}
              setRefreshData={setRefreshData}
              toast={toast}
              searchValue={searchValue}
              searchOption={searchOption}
            />
          </>
        )}
      </CustomTabPanel>
    </Box>
  );
}
