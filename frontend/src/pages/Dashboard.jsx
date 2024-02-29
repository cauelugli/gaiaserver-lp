/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import * as React from "react";
import axios from "axios";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Typography,
} from "@mui/material";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

import MyCalendar from "../components/MyCalendar";

const Dashboard = ({ user }) => {
  return (
    <Grid>
      <Accordion sx={{ mx: "20%" }} defaultExpanded>
        <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
          <Typography sx={{ fontSize: 22, fontWeight: "bold" }}>
            Minha Agenda
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <MyCalendar user={user} />
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
};

export default Dashboard;
