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
import WorkerSelect from "../components/small/selects/WorkerSelect";

const Dashboard = ({
  user,
  configDashboard,
  configAgenda,
  configCustomization,
}) => {
  const [worker, setWorker] = React.useState("");
  const [expanded, setExpanded] = React.useState(
    user.username === "admin" ? false : true
  );
  const [showAgenda, setShowAgenda] = React.useState(true);

  React.useEffect(() => {
    configDashboard && setShowAgenda(configDashboard.showAgenda);
  }, [configDashboard]);

  return (
    <Grid>
      {user.username === "admin" ? (
        <Typography sx={{ fontSize: 23, m: 2, fontWeight: "bold" }}>
          Bem vindo, {user.name}
        </Typography>
      ) : (
        <Typography sx={{ fontSize: 23, m: 2, fontWeight: "bold" }}>
          Bem vind{user.gender === "m" ? "o" : "a"}, {user.name}
        </Typography>
      )}
      {user.username === "admin" && showAgenda && (
        <Typography
          sx={{
            mb: 1,
            fontSize: 12,
            textAlign: "right",
            cursor: "pointer",
            color: configCustomization
              ? configCustomization.mainColor
              : "black",
          }}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Minimizar Agenda" : "Maximizar Agenda"}
        </Typography>
      )}
      {showAgenda && (
        <Accordion sx={{ m: 2 }} expanded={expanded}>
          {user.username === "admin" ? (
            <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
              <Grid
                container
                direction="row"
                alignItems="center"
                justifyContent="flex-start"
              >
                <Typography sx={{ fontSize: 22, fontWeight: "bold", mr: 2 }}>
                  Agenda
                </Typography>
                {user.username === "admin" && (
                  <WorkerSelect setWorker={setWorker} needId />
                )}
              </Grid>
            </AccordionSummary>
          ) : (
            <AccordionSummary
              expandIcon={<ArrowDropDownIcon />}
              onClick={() => setExpanded(!expanded)}
            >
              <Typography sx={{ fontSize: 22, fontWeight: "bold" }}>
                Minha Agenda
              </Typography>
            </AccordionSummary>
          )}
          <AccordionDetails>
            <MyCalendar
              user={user}
              config={configAgenda}
              selectedWorker={worker}
            />
          </AccordionDetails>
        </Accordion>
      )}
    </Grid>
  );
};

export default Dashboard;
