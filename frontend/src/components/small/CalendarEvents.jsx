/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";

import { Grid, Typography } from "@mui/material";

const CalendarEvents = ({ event }) => {
  return (
    <Grid>
      <Typography
        sx={{
          textAlign: "center",
          fontSize: 15,
          color: "black",
          mb: 1.5,
          fontWeight: "bold",
        }}
      >
        {event.title}
      </Typography>
      {event.service.name && (
        <Typography sx={{ fontSize: 13, color: "black" }}>
          <strong>Serviço:</strong> {event.service.name}
        </Typography>
      )}
      {event.customer.name && (
        <Typography sx={{ fontSize: 13, color: "black" }}>
          <strong>Cliente:</strong> {event.customer.name}
        </Typography>
      )}
    </Grid>
  );
};

export default CalendarEvents;
