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

import MyCalendar from "../components/MyCalendar";

const Dashboard = ({ user, config }) => {
  return (
    <Grid>
      <Accordion sx={{ mx: "20%" }} defaultExpanded>
        <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
          <Typography sx={{ fontSize: 22, fontWeight: "bold" }}>
            Minha Agenda
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <MyCalendar user={user} config={config}/>
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
};

export default Dashboard;
