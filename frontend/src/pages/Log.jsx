/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import * as React from "react";

import { Box, Grid, Typography } from "@mui/material";
import LogTable from "../tables/LogTable";
import { useAppData } from "../AppDataContext";

import { icons } from "../../src/icons";

const Log = ({ api, topBar, mainColor }) => {
  const appData = useAppData();
  const idIndexList = appData.idIndexList;
  const [logs, setLogs] = React.useState([]);
  const [refreshData, setRefreshData] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const resLogs = await api.get("/get", {
          params: { model: "Log" },
        });

        setLogs(resLogs.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [api, idIndexList, refreshData]);

  return (
    <Box sx={{ width: topBar ? "105%" : "100%", minHeight: "50vw" }}>
      <Grid container>
        <Typography sx={{ fontSize: 25, m: 2, fontWeight: "bold" }} id="title">
          Logs do Sistema{" "}
        </Typography>

        <Grid
          container
          direction="row"
          alignItems="center"
          justifyContent="center"
          onClick={() => {
            setRefreshData(!refreshData);
          }}
          sx={{
            cursor: "pointer",
            width: "2vw",
            height: "2vw",
            m: 0.5,
            my: "auto",
            mx: 1.5,
            border: `0.5px solid ${mainColor ? mainColor : "#32aacd"}`,
            borderRadius: 3,
          }}
        >
          <icons.RefreshIcon
            sx={{
              color: mainColor ? mainColor : "#32aacd",
            }}
          />
        </Grid>
      </Grid>

      <LogTable items={logs} idIndexList={idIndexList} />
    </Box>
  );
};

export default Log;
