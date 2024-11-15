/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";

import { Button, Grid } from "@mui/material";

const CalendarFooter = (props) => {
  return (
    <Grid
      sx={{
        height: 150,
        width: "auto",
        backgroundColor: "#f8f8ff",
        border: "1px solid #e7e7ee",
        borderRadius: 3,
        mt: 1,
      }}
    >
      {props.selectedDay}
      <Button onClick={() => console.log("userAgenda", props.userAgenda)}>
        see agenda
      </Button>
    </Grid>
  );
};

export default CalendarFooter;
