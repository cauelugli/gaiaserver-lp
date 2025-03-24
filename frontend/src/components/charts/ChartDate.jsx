/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import {
//   Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid2,
  TextField,
  IconButton,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { icons } from "../../icons";

const ChartDate = ({ groupBy, selectedDate, setSelectedDate }) => {
  // eslint-disable-next-line no-unused-vars
  const [localDate, setLocalDate] = useState({
    type: groupBy,
    value: selectedDate.value || [],
  });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [applied, setApplied] = useState(false);

  const months = [
    { value: "01", label: "Janeiro" },
    { value: "02", label: "Fevereiro" },
    { value: "03", label: "Março" },
    { value: "04", label: "Abril" },
    { value: "05", label: "Maio" },
    { value: "06", label: "Junho" },
    { value: "07", label: "Julho" },
    { value: "08", label: "Agosto" },
    { value: "09", label: "Setembro" },
    { value: "10", label: "Outubro" },
    { value: "11", label: "Novembro" },
    { value: "12", label: "Dezembro" },
  ];

  useEffect(() => {
    setLocalDate((prev) => ({
      ...prev,
      type: groupBy,
      value: [],
    }));
    setStartDate(null);
    setEndDate(null);
    setSelectedMonths([]);
    setApplied(false);
  }, [groupBy]);

  const handleMonthChange = (event) => {
    const { value } = event.target;
    setSelectedMonths(value);
    setApplied(false);
  };

  const handleDateChange = (setter) => (newValue) => {
    setter(newValue);
    setApplied(false);
  };

  const handleApplyDates = () => {
    if (groupBy === "day") {
      if (startDate && endDate) {
        const formattedStart = startDate.format("DD/MM/YYYY");
        const formattedEnd = endDate.format("DD/MM/YYYY");
        setLocalDate({
          type: "day",
          value: [formattedStart, formattedEnd],
        });
        setSelectedDate({
          type: "day",
          value: [formattedStart, formattedEnd],
        });
        setApplied(true);
      }
    } else if (groupBy === "month") {
      if (selectedMonths.length > 0) {
        setLocalDate({
          type: "month",
          value: selectedMonths,
        });
        setSelectedDate({
          type: "month",
          value: selectedMonths,
        });
        setApplied(true);
      }
    }
  };

  const handleClearDates = () => {
    setSelectedDate({
      type: groupBy,
      value: [],
    });
    setLocalDate({
      type: groupBy,
      value: [],
    });
    setStartDate(null);
    setEndDate(null);
    setSelectedMonths([]);
    setApplied(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <Grid2 container spacing={1} alignItems="center" sx={{ ml: 1, mt: -2 }}>
        {groupBy === "day" ? (
          <>
            <Grid2 item sx={{ width: 200 }}>
              <DatePicker
                label="Data Inicial"
                value={startDate}
                onChange={handleDateChange(setStartDate)}
                renderInput={(params) => <TextField {...params} />}
                format="DD/MM/YYYY"
                disabled={applied}
              />
            </Grid2>
            <Grid2 item sx={{ width: 200 }}>
              <DatePicker
                label="Data Final"
                value={endDate}
                onChange={handleDateChange(setEndDate)}
                renderInput={(params) => <TextField {...params} />}
                minDate={startDate}
                format="DD/MM/YYYY"
                disabled={applied}
              />
            </Grid2>
          </>
        ) : groupBy === "month" ? (
          <Grid2 item>
            <FormControl sx={{ width: 200 }}>
              <InputLabel>Meses</InputLabel>
              <Select
                multiple
                value={selectedMonths}
                onChange={handleMonthChange}
                label="Meses"
                disabled={applied}
              >
                {months.map((month) => (
                  <MenuItem key={month.value} value={month.value}>
                    {month.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid2>
        ) : null}

        <Grid2 item>
          {applied ? (
            <IconButton
              color="error"
              onClick={handleClearDates}
              size="small"
              sx={{ ml: 1 }}
            >
              <icons.ClearIcon />
            </IconButton>
          ) : (
            <IconButton
              color="primary"
              onClick={handleApplyDates}
              disabled={
                (groupBy === "day" && (!startDate || !endDate)) ||
                (groupBy === "month" && selectedMonths.length === 0)
              }
              size="small"
              sx={{ ml: 1 }}
            >
              <icons.CheckIcon />
            </IconButton>
          )}
        </Grid2>
      </Grid2>
    </LocalizationProvider>
  );
};

export default ChartDate;
