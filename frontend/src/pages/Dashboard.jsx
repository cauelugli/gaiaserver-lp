/* eslint-disable react/prop-types */
import * as React from "react";

import { Box, CircularProgress, Typography } from "@mui/material";

const Dashboard = ({ configDashboard, topBar }) => {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (configDashboard) {
      setIsLoading(false);
    }
  }, [configDashboard]);

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
      <Typography sx={{ fontSize: 25, m: 2, fontWeight: "bold" }}>
        Dashboard
      </Typography>
    </Box>
  );
};

export default Dashboard;
