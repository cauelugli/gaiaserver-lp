/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { InputLabel, Grid, Select, MenuItem } from "@mui/material";

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

        let serviceLength;
        switch (props.serviceLength) {
          case "30 min":
            serviceLength = 30;
            break;
          case "1h":
            serviceLength = 60;
            break;
          case "1:30h":
            serviceLength = 90;
            break;
          case "2h":
            serviceLength = 120;
            break;
          case "2:30h":
            serviceLength = 150;
            break;
          case "3h ou mais":
            serviceLength = 180;
            break;
          default:
            serviceLength = 60;
        }

        const slots = [];
        let currentTime = configAgenda.data.minTime * 60;

        while (currentTime + serviceLength <= configAgenda.data.maxTime * 60) {
          const startHour = Math.floor(currentTime / 60);
          const startMinute = currentTime % 60;

          const endHour = Math.floor((currentTime + serviceLength) / 60);
          const endMinute = (currentTime + serviceLength) % 60;

          const slot = `${String(startHour).padStart(2, "0")}:${String(
            startMinute
          ).padStart(2, "0")}h ~ ${String(endHour).padStart(2, "0")}:${String(
            endMinute
          ).padStart(2, "0")}h`;
          slots.push(slot);

          currentTime += serviceLength;
        }

        setTimeSlots(slots);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [props.api, props.serviceLength]);

  return (
    <Grid container direction="column" sx={{ width: 200 }}>
      <InputLabel>Selecione um Horário</InputLabel>
      <Select
        size="small"
        renderValue={(selected) => (selected ? selected : "Selecione")}
      >
        {timeSlots.map((slot, index) => (
          <MenuItem value={slot} key={index}>
            {slot}
          </MenuItem>
        ))}
      </Select>
    </Grid>
  );
};

export default ScheduleTableCell;
