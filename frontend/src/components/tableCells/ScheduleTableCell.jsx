/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";

import { InputLabel, Grid2, Select, MenuItem } from "@mui/material";

import { createScheduleSlots } from "../../../../controllers/functions/overallFunctions";

const ScheduleTableCell = (props) => {
  const [minTime, setMinTime] = React.useState(0);
  const [maxTime, setMaxTime] = React.useState(0);
  const [timeSlots, setTimeSlots] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const configAgenda = await props.api.get("/config/specific", {
          params: { key: "agenda", items: ["minTime", "maxTime"] },
        });
        setMinTime(configAgenda.data.minTime);
        setMaxTime(configAgenda.data.maxTime);

        const slots = createScheduleSlots(
          configAgenda.data.minTime,
          configAgenda.data.maxTime,
          props.serviceLength
        );
        setTimeSlots(slots);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [props.api, props.serviceLength]);

  const handleSelectionChange = (event) => {
    props.setSelectedSchedule(event.target.value);
  };

  return (
    <Grid2 container direction="column" sx={{ width: 200 }}>
      <InputLabel>Selecione um Horário</InputLabel>
      <Select
        value={props.selectedSchedule}
        onChange={handleSelectionChange}
        size="small"
        renderValue={(selected) => (selected ? selected : "Selecione")}
      >
        {timeSlots.map((slot, index) => (
          <MenuItem value={slot} key={index}>
            {slot}
          </MenuItem>
        ))}
      </Select>
    </Grid2>
  );
};

export default ScheduleTableCell;
