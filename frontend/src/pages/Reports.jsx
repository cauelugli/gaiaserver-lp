/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
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

import TableFilters from "../components/TableFilters";
import RefreshButton from "../components/small/buttons/RefreshButton";
import NoDataText from "../components/small/NoDataText";
import SmartReports from "../components/SmartReports";
import QueryMaker from "../components/small/QueryMaker";

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

export default function Reports({ users, customers, requests, topBar }) {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

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
    <Box sx={{ width: topBar ? "105%" : "100%", minHeight: "50vw" }}>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        sx={{ m: 2 }}
      >
        <Typography sx={{ fontSize: 25, mr: 1, mb: 2, fontWeight: "bold" }}>
          Relatórios
        </Typography>
        <SmartReports
          users={users}
          customers={customers}
          requests={requests}
          fromPage
        />
        <Typography sx={{ fontSize: 25, mr: 1, my: 2, fontWeight: "bold" }}>
          Relatório Avançado
        </Typography>
        <QueryMaker />
      </Grid>
    </Box>
  );
}
