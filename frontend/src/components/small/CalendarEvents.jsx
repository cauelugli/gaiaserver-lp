/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";

import { Grid2, Typography } from "@mui/material";

const CalendarEvents = ({ event }) => {
  return (
    <Grid2>
      <Typography
        sx={{
          textAlign: "center",
          fontSize: 15,
          color: "black",
          mb: 1,
          fontWeight: "bold",
        }}
      >
        {event.title}
      </Typography>

      {event.service && event.service.name && (
        <Typography sx={{ fontSize: 13, color: "black", mt: 0.5 }}>
          <strong>Serviço:</strong> {event.service.name}
        </Typography>
      )}
      {event.customer && event.customer.name && (
        <Typography sx={{ fontSize: 13, color: "black", mt: 0.5 }}>
          <strong>Cliente:</strong> {event.customer.name}
        </Typography>
      )}

      {event.worker && (
        <Typography sx={{ fontSize: 13, color: "black", mt: 0.5 }}>
          <strong>Colaborador:</strong> {event.worker}
        </Typography>
      )}

      {event.group && event.group.name && (
        <Typography sx={{ fontSize: 13, color: "black", mt: 0.5 }}>
          <strong>Grupo:</strong> {event.group.name}
        </Typography>
      )}
    </Grid2>
  );
};

export default CalendarEvents;
