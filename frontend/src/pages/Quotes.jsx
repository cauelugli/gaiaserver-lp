/* eslint-disable react/prop-types */
import React from "react";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

import {
  Box,
  CircularProgress,
  Grid,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

import QuoteTable from "../tables/QuoteTable";

import RefreshButton from "../components/small/buttons/RefreshButton";
import NoDataText from "../components/small/NoDataText";
import TableOrCardSelector from "../components/small/TableOrCardSelector";
import QuoteCard from "../components/cards/QuoteCard";

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

export default function Quotes({
  userId,
  configData,
  topBar,
  tableOrCardView,
  setUserPreferences,
  users,
  cardSize,
}) {
  const [isLoading, setIsLoading] = React.useState(true);

  const [refreshData, setRefreshData] = React.useState(false);
  const [newDataRefreshButton, setNewDataRefreshButton] = React.useState(true);
  const [value, setValue] = React.useState(0);

  const [quotes, setQuotes] = React.useState([]);
  const [configCustomization, setConfigCustomization] = React.useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const quotes = await api.get("/quotes");
        const configCustomization = await api.get("/config");
        setQuotes(quotes.data);
        setConfigCustomization(configCustomization.data[0].customization);
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
      <Typography sx={{ fontSize: 25, ml: 2, fontWeight: "bold" }}>
        Orçamentos
      </Typography>
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
        {quotes.filter((quote) => quote.type === "job").length === 0 ? (
          <NoDataText option="Orçamentos de Jobs" />
        ) : (
          <>
            {tableOrCardView ? (
              <QuoteTable
                quotes={quotes.filter((quote) => quote.type === "job")}
                config={configData}
                type={"job"}
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
                {quotes
                  .filter((q) => q.type === "job")
                  .map((quote, index) => (
                    <Grid
                      item
                      key={index}
                      md={cardSize}
                      lg={cardSize}
                      xl={cardSize}
                    >
                      <QuoteCard quote={quote} type="job" users={users} />
                    </Grid>
                  ))}
              </Grid>
            )}
          </>
        )}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {quotes.filter((quote) => quote.type === "sale").length === 0 ? (
          <NoDataText option="Orçamentos de Vendas" />
        ) : (
          <>
            {tableOrCardView ? (
              <QuoteTable
                quotes={quotes.filter((quote) => quote.type === "sale")}
                type={"sale"}
                config={configData}
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
                {quotes
                  .filter((q) => q.type === "sale")
                  .map((quote, index) => (
                    <Grid
                      item
                      key={index}
                      md={cardSize}
                      lg={cardSize}
                      xl={cardSize}
                    >
                      <QuoteCard quote={quote} type="sale" users={users} />
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
