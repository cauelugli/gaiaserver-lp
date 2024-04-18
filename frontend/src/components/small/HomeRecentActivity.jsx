/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

import { Grid, InputAdornment, TextField, Typography } from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const socket = io("http://localhost:3000");

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const HomeRecentActivity = ({ mainColor = "#000000" }) => {
  const [selectedHeight, setSelectedHeight] = useState(80);
  const [recentActivities, setRecentActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [searchValue, setSearchValue] = React.useState("");
  const [searchDateInitial, setSearchDateInitial] = React.useState(null);
  const [searchDateFinal, setSearchDateFinal] = React.useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const recentActivities = await api.get("/recentActivity");
        setRecentActivities(recentActivities.data.reverse());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    socket.on("recentActivityRefresh", () => {
      const fetchData = async () => {
        try {
          const recentActivities = await api.get("/recentActivity");
          setRecentActivities(recentActivities.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    });

    return () => {
      socket.off("recentActivityRefresh");
    };
  }, []);

  useEffect(() => {
    const filtered = recentActivities.filter((activity) => {
      const activityDate = dayjs(activity.createdAt, "DD/MM/YYYY HH:mm:ss");
      const searchDateMatch =
        searchDateInitial && searchDateFinal
          ? activityDate.isBetween(
              searchDateInitial,
              searchDateFinal,
              "day",
              "[]"
            )
          : true;
      const searchTextMatch = activity.activity
        .toLowerCase()
        .includes(searchValue.toLowerCase());

      return searchTextMatch && searchDateMatch;
    });
    setFilteredActivities(filtered);
  }, [searchValue, searchDateInitial, searchDateFinal, recentActivities]);

  const eventStyleGetter = () => {
    const hexToRGB = (hex) => {
      let r, g, b;
      r = parseInt(hex[1] + hex[2], 16);
      g = parseInt(hex[3] + hex[4], 16);
      b = parseInt(hex[5] + hex[6], 16);
      return [r, g, b];
    };

    const [r, g, b] = hexToRGB(mainColor);

    let style = {
      backgroundColor: `rgba(${r}, ${g}, ${b}, 0.2)`,
    };

    return {
      style: style,
    };
  };

  const eventStyle = eventStyleGetter().style;

  return (
    <Grid sx={{ width: 700, px: 1 }}>
      <Grid item>
        <Grid container direction="row" justifyContent="space-between">
          <Typography
            sx={{
              fontWeight: "bold",
              fontSize: 18,
              ml: 0.5,
            }}
          >
            Atividade Recente
          </Typography>
          <Grid item>
            <Grid container>
              <Typography
                sx={{
                  fontSize: 20,
                  mr: 1.5,
                  color: mainColor,
                  cursor: "pointer",
                }}
                onClick={() => setSelectedHeight(selectedHeight + 160)}
              >
                +
              </Typography>
              <Typography
                sx={{
                  fontSize: 20,
                  mr: 0.5,
                  cursor: selectedHeight === 80 ? "" : "pointer",
                  color: selectedHeight === 80 ? "darkgrey" : "black",
                }}
                onClick={() => setSelectedHeight(80)}
              >
                -
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid
        sx={{
          height: selectedHeight,
          width: "auto",
          border: `1px solid ${mainColor}`,
          borderRadius: 2,
          overflow: "auto",
          ...eventStyle,
        }}
      >
        <Grid container direction="column">
          {selectedHeight >= 240 && (
            <Grid
              item
              sx={{ width: "100%", mt:1 }}
              container
              direction="row"
              alignItems="center"
              justifyContent="space-evenly"
            >
              <TextField
                placeholder="Pesquise..."
                size="small"
                sx={{ mx: 2, mt: 1, backgroundColor: "white" }}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment:
                    searchValue.length > 0 ? (
                      <InputAdornment position="end">
                        <ClearIcon
                          cursor="pointer"
                          sx={{ color: "#d21404" }}
                          onClick={() => setSearchValue("")}
                        />
                      </InputAdornment>
                    ) : (
                      ""
                    ),
                }}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  format="DD/MM/YYYY"
                  label={searchDateInitial ? null : "De"}
                  value={searchDateInitial}
                  onChange={(newValue) => {
                    setSearchDateInitial(dayjs(newValue, "DD/MM/YYYY"));
                  }}
                  sx={{
                    // o overwrite do Mui está aqui
                    "& .MuiInputBase-root": {
                      mt: 1,
                      backgroundColor: "white",
                      height: 40,
                      width: 150,
                      mx: "auto",
                    },
                  }}
                />
                <DatePicker
                  format="DD/MM/YYYY"
                  label={searchDateFinal ? null : "Até"}
                  value={searchDateFinal}
                  onChange={(newValue) => {
                    setSearchDateFinal(dayjs(newValue, "DD/MM/YYYY"));
                  }}
                  sx={{
                    "& .MuiInputBase-root": {
                      mt: 1,
                      backgroundColor: "white",
                      height: 40,
                      width: 150,
                      mx: "auto",
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
          )}
          {filteredActivities.reverse().map((activity) => (
            <Grid key={activity.id} item sx={{ mt: 1, px: 1 }}>
              <Typography sx={{ ml: 1, maxWidth: 650 }}>
                <Typography sx={{ fontSize: 12, color: "grey" }}>
                  {activity.createdAt}
                </Typography>
                {activity.activity}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default HomeRecentActivity;
