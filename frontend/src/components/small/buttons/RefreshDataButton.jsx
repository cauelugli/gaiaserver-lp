/* eslint-disable react/prop-types */
import * as React from "react";

import { io } from "socket.io-client";

const socket = io("http://localhost:5002");

import { Badge, Grid } from "@mui/material";

import { icons } from "../../../icons";

export default function RefreshDataButton({
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
    <Grid
      container
      direction="row"
      alignItems="center"
      justifyContent="center"
      onClick={() => {
        setRefreshData(!refreshData), setNewDataRefreshButton(true);
      }}
      sx={{
        cursor: "pointer",
        width: 50,
        m: 0.75,
        mx: 1.5,
        border: `0.5px solid ${
          configCustomization.mainColor
            ? configCustomization.mainColor
            : "#32aacd"
        }`,
        borderRadius: 3,
      }}
    >
      <Badge
        color="success"
        variant="dot"
        sx={{ m: 0.5 }}
        invisible={newDataRefreshButton}
      >
        <icons.RefreshIcon
          sx={{
            color: configCustomization.mainColor
              ? configCustomization.mainColor
              : "#32aacd",
          }}
        />
      </Badge>
    </Grid>
  );
}
