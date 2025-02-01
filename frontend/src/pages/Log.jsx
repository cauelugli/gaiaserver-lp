/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import * as React from "react";

import { Box, Typography } from "@mui/material";
import LogTable from "../tables/LogTable";
import { useAppData } from "../AppDataContext";

const Log = ({ api, topBar }) => {
  const appData = useAppData();
  const idIndexList = appData.idIndexList;
  const [logs, setLogs] = React.useState([]);

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
  }, [api, idIndexList]);

  return (
    <Box sx={{ width: topBar ? "105%" : "100%", minHeight: "50vw" }}>
      <Typography sx={{ fontSize: 25, m: 2, fontWeight: "bold" }} id="title">
        Logs do Sistema
      </Typography>
      <Typography sx={{ fontSize: 25, m: 2, fontWeight: "bold" }} id="title">
        Terminal
      </Typography>
      <Typography sx={{ fontSize: 25, m: 2, fontWeight: "bold" }} id="title">
        Atividade Recente
      </Typography>
      <LogTable items={logs} idIndexList={idIndexList} />
    </Box>
  );
};

export default Log;
