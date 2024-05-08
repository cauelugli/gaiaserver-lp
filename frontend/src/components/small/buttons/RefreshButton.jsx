/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import * as React from "react";

import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

import { Badge, Box, Typography } from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";

export default function RefreshButton({
  refreshData,
  setRefreshData,
  configCustomization,
}) {
  const currentPath = window.location.pathname;
  const [newDataRefreshButton, setNewDataRefreshButton] = React.useState(true);

  // force refresh from websocket
  React.useEffect(() => {
    socket.on("newDataRefreshButton", (page) => {
      // Verifica se o final da URL corresponde à página 'page'
      if (currentPath.endsWith(`/${page.page}`)) {
        console.log("Atualizando dados, pois estamos na página correta");
        setNewDataRefreshButton(false);
      }
    });

    return () => {
      socket.off("newDataRefreshButton");
    };
  }, [currentPath]);

  return (
    <Box
      onClick={() => {
        setRefreshData(!refreshData), setNewDataRefreshButton(true);
      }}
      sx={{ cursor: "pointer", mt: 0.5 }}
    >
      <Badge
        color="primary"
        variant="dot"
        sx={{ m: 0.5 }}
        // this is THE prop, make the magic happen here
        invisible={newDataRefreshButton}
      >
        <RefreshIcon
          sx={{
            color: configCustomization.mainColor
              ? configCustomization.mainColor
              : "#32aacd",
          }}
        />
        <Typography
          sx={{
            fontSize: 12,
            m: 0.5,
            color: configCustomization.mainColor
              ? configCustomization.mainColor
              : "#32aacd",
          }}
        >
          ATUALIZAR
        </Typography>
      </Badge>
    </Box>
  );
}
