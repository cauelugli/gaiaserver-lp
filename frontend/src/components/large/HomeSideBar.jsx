/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";

import { Grid } from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

import dayjs from "dayjs";
import "dayjs/locale/pt-br";

import UserShortcuts from "../small/UserShortcuts";
import CalendarFooter from "../small/CalendarFooter";

const customPtBrLocale = {
  ...dayjs.Ls["pt-br"],
  weekdaysMin: ["D", "S", "T", "Q", "Q", "S", "S"],
  months: [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ],
};

dayjs.locale(customPtBrLocale);

const HomeSideBar = ({
  userId,
  handleShortcutClick,
  allowedLinks,
  userAgenda,
  mainColor,
}) => {
  const [selectedDay, setSelectedDay] = React.useState(dayjs());

  return (
    <Grid>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          views={["day", "month"]}
          sx={{
            bgcolor: "#f8f8ff",
            color: "black",
            "& .MuiTypography-root": { color: "black" },
            "& .MuiPickersDay-root": {
              color: "black",
            },
            borderRadius: 2,
            boxShadow: 1,
          }}
          value={selectedDay}
          onChange={(newDay) => setSelectedDay(newDay)}
        />
      </LocalizationProvider>
      <CalendarFooter
        selectedDay={dayjs(selectedDay).format("DD/MM/YYYY")}
        userAgenda={userAgenda}
        mainColor={mainColor}
      />
      <UserShortcuts
        userId={userId}
        onShortcutClick={handleShortcutClick}
        allowedLinks={allowedLinks}
      />
    </Grid>
  );
};

export default HomeSideBar;
