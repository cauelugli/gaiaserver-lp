/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import * as React from "react";

import { Box, Typography } from "@mui/material";

const Reports = (props) => {
  return (
    <Box sx={{ width: props.topBar ? "105%" : "100%", minHeight: "50vw" }}>
      <Typography sx={{ fontSize: 25, ml: 2, fontWeight: "bold" }} id="title">
        Relatórios
      </Typography>
    </Box>
  );
};

export default Reports;
