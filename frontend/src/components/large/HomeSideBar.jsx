/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";

import { Collapse, Grid, IconButton, Typography } from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

import { icons } from "../../icons";

import dayjs from "dayjs";
import "dayjs/locale/pt-br";

import UserShortcuts from "../small/UserShortcuts";
import DayEvents from "../small/DayEvents";

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
  const [openCalendar, setOpenCalendar] = React.useState(true);

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      sx={{ ml:2, width: "80%" }}
    >
      <Grid
        container
        direction="row"
        justifyContent="space-around"
        alignItems="center"
        sx={{
          backgroundColor: "#f8f8ff",
          border: "1px solid #e7e7ee",
          borderRadius: 3,
          width: 320,
        }}
      >
        <Typography id="ghost" />
        <Typography
          sx={{
            px: "25%",
            mt: -1,
            fontSize: 16,
            fontWeight: "bold",
            color: "#555",
            fontFamily: "Verdana, sans-serif",
          }}
        >
          Calendário
        </Typography>
        <IconButton
          onClick={() => setOpenCalendar(!openCalendar)}
          sx={{ mb: 1, color: "black" }}
        >
          {openCalendar ? <icons.ExpandLessIcon /> : <icons.ExpandMoreIcon />}
        </IconButton>
        <Grid item>
          <Collapse in={openCalendar}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar
                value={selectedDay}
                onChange={(newDay) => setSelectedDay(newDay)}
                views={["day", "month"]}
                sx={{
                  bgcolor: "#f8f8ff",
                  color: "black",
                  "& .MuiTypography-root": { color: "black" },
                  "& .MuiPickersDay-root": { color: "black" },
                  borderRadius: 2,
                  boxShadow: 1,
                }}
              />
            </LocalizationProvider>
          </Collapse>
        </Grid>
      </Grid>

      <DayEvents
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
