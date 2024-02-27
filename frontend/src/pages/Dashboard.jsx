/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import * as React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Typography,
} from "@mui/material";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import MyCalendar from "../components/MyCalender";

const Dashboard = ({ user }) => {
  return (
    <Grid>
      <Accordion sx={{mx:"20%"}}>
        <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
          <Typography sx={{ fontSize: 22, fontWeight: "bold" }}>
            Agenda
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <MyCalendar />
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
};

export default Dashboard;
