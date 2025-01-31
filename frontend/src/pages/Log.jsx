/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import * as React from "react";

import { Box, CircularProgress, Typography } from "@mui/material";

const Log = ({ topBar }) => {
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
    </Box>
  );
};

export default Log;
