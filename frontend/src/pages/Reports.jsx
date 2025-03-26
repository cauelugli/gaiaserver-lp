/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import * as React from "react";

import { Box } from "@mui/material";
import ChartReports from "../components/charts/ChartReports";

const Reports = (props) => {
  return (
    <Box sx={{ width: props.topBar ? "105%" : "100%", minHeight: "50vw" }}>
      <ChartReports
        api={props.api}
        mainColor={props.mainColor}
        windowSizeSetter={props.windowSizeSetter}
        fromPage
      />
    </Box>
  );
};

export default Reports;
