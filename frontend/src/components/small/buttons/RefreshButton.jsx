/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import * as React from "react";

import { Box, IconButton, Typography } from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";

export default function RefreshButton({
  refreshData,
  setRefreshData,
  configCustomization,
}) {
  return (
    <Box sx={{ m: 1 }}>
      <IconButton size="inherit" onClick={() => setRefreshData(!refreshData)}>
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
            ml: 0.5,
            color: configCustomization.mainColor
              ? configCustomization.mainColor
              : "#32aacd",
          }}
        >
          ATUALIZAR
        </Typography>
      </IconButton>
    </Box>
  );
}
