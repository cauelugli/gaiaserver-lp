/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import * as React from "react";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import MyCalendar from "../components/MyCalendar";
import WorkerSelect from "../components/small/selects/WorkerSelect";
import WelcomingMessage from "../components/small/WelcomingMessage";
import SmartReports from "../components/SmartReports";

const Dashboard = ({
  user,
  users,
  requests,
  customers,
  configDashboard,
  configAgenda,
  configCustomization,
}) => {
  const [isLoading, setIsLoading] = React.useState(true);

  const [worker, setWorker] = React.useState("");
  const [expanded, setExpanded] = React.useState(
    user.username === "admin" ? false : true
  );

  const [showAgenda, setShowAgenda] = React.useState(true);

  React.useEffect(() => {
    if (configDashboard) {
      setShowAgenda(configDashboard.showAgenda);
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
    <Grid>
      <Typography sx={{ fontSize: 25, m: 2, fontWeight: "bold" }}>
        Dashboard
      </Typography>
      {showAgenda && (
        <>
          <Typography
            sx={{
              opacity: user.username === "admin" && showAgenda ? 1 : 0,
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
        </>
      )}
      <SmartReports requests={requests} customers={customers} users={users} />
    </Grid>
  );
};

export default Dashboard;
