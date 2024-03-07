/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";

import { Typography } from "@mui/material";

const CalendarEvents = ({ event }) => {
  return (
    <Typography>
      <span>{event.title}</span>
    </Typography>
  );
};

export default CalendarEvents;
