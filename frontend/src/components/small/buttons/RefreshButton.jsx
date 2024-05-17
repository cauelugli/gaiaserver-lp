/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import * as React from "react";

import { io } from "socket.io-client";

const socket = io("http://localhost:5002");

import { Badge, Box, Typography } from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";

export default function RefreshButton({
  refreshData,
  setRefreshData,
  configCustomization,
  newDataRefreshButton,
  setNewDataRefreshButton,
  userId,
}) {
  const currentPath = window.location.pathname;

  React.useEffect(() => {
    const handleNewData = (data) => {
      // Verifica se o final da URL corresponde à página recebida
      // e se o userId recebido pelo WebSocket é diferente do userIdProp
      if (currentPath.endsWith(`/${data.page}`) && data.userId !== userId) {
        setNewDataRefreshButton(false);
      }
    };

    socket.on("newDataRefreshButton", handleNewData);

    return () => {
      socket.off("newDataRefreshButton", handleNewData);
    };
  }, [currentPath, setNewDataRefreshButton, userId]);

  return (
    <Box
      onClick={() => {
        setRefreshData(!refreshData), setNewDataRefreshButton(true);
      }}
      sx={{ cursor: "pointer", mt: 0.5 }}
    >
      <Badge
        color="success"
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
