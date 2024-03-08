/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import * as React from "react";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Select,
  Typography,
} from "@mui/material";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import MyCalendar from "../components/MyCalendar";
import WorkerSelect from "../components/small/selects/WorkerSelect";

const Dashboard = ({ user, config }) => {
  const [worker, setWorker] = React.useState("");

  return (
    <Grid>
      <Accordion sx={{ mx: "20%" }} defaultExpanded>
        {user.username === "admin" ? (
          <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
            <Grid
              container
              direction="row"
              alignItems="center"
              justifyContent="flex-start"
            >
              <Typography sx={{ fontSize: 22, fontWeight: "bold", mr:2 }}>
                Agenda
              </Typography>
              {user.username === "admin" && (
                <WorkerSelect setWorker={setWorker} needId />
              )}
            </Grid>
          </AccordionSummary>
        ) : (
          <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
            <Typography sx={{ fontSize: 22, fontWeight: "bold" }}>
              Minha Agenda
            </Typography>
          </AccordionSummary>
        )}

        <AccordionDetails>
          <MyCalendar user={user} config={config} selectedWorker={worker} />
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
};

export default Dashboard;
