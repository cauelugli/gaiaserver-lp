/* eslint-disable react/prop-types */
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
import SmartReports from "../components/SmartReports";

const Dashboard = ({
  userId,
  userUsername,
  users,
  requests,
  customers,
  configDashboard,
  configAgenda,
  configCustomization,
  topBar,
}) => {
  const [isLoading, setIsLoading] = React.useState(true);

  const [worker, setWorker] = React.useState("");
  const [expanded, setExpanded] = React.useState(
    userUsername === "admin" ? false : true
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
    <Box sx={{ width: topBar ? "105%" : "100%", minHeight: "50vw" }}>
      <Typography sx={{ fontSize: 25, m: 2, fontWeight: "bold" }}>
        Dashboard
      </Typography>
      {showAgenda && (
        <>
          <Typography
            sx={{
              opacity: userUsername === "admin" && showAgenda ? 1 : 0,
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
            {userUsername === "admin" ? (
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
                  {userUsername === "admin" && (
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
                userId={userId}
                config={configAgenda}
                selectedWorker={worker}
              />
            </AccordionDetails>
          </Accordion>
        </>
      )}
      <SmartReports requests={requests} customers={customers} users={users} />
    </Box>
  );
};

export default Dashboard;
