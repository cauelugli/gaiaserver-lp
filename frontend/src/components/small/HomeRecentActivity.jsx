/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
// import { toast } from "react-toastify";
import { io } from "socket.io-client";
import axios from "axios";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

import {
  Grid2,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";

import { icons } from "../../icons";

import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const socket = io("http://localhost:5002");

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const HomeRecentActivity = ({ userUsername, mainColor = "#000000" }) => {
  const [selectedHeight, setSelectedHeight] = useState(80);
  const [recentActivities, setRecentActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [searchValue, setSearchValue] = React.useState("");
  const [searchDateInitial, setSearchDateInitial] = React.useState(null);
  const [searchDateFinal, setSearchDateFinal] = React.useState(null);

  useEffect(() => {
    socket.on("recentActivityRefresh", () => {
      const fetchData = async () => {
        try {
          const recentActivities = await api.get("/recentActivity");
          setRecentActivities(recentActivities.data.reverse());
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

  return (
    <>
      <Grid2 sx={{ width: 700, mt:3 }}>
        <Grid2 item>
          <Grid2 container direction="row" justifyContent="space-between">
            <Grid2 item>
              <Typography
                sx={{
                  fontWeight: "bold",
                  fontSize: 18,
                }}
              >
                Atividade Recente
                {userUsername === "admin" && recentActivities.length !== 0 && (
                  <IconButton size="small" 
                  // onClick={() => setOpenDialog(true)}
                  >
                    <icons.DeleteIcon
                      sx={{
                        color: "#555",
                        "&:hover": {
                          color: "red",
                        },
                      }}
                    />
                  </IconButton>
                )}
              </Typography>
            </Grid2>
            <Grid2 item>
              <Grid2 container>
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
              </Grid2>
            </Grid2>
          </Grid2>
        </Grid2>

        <Grid2
          sx={{
            height: selectedHeight,
            width: "auto",
            // border: `1px solid ${mainColor}`,
            // borderRadius: 2,
            overflow: "auto",
            // ...eventStyle,
          }}
        >
          <Grid2 container direction="column">
            {selectedHeight >= 240 && recentActivities.length !== 0 && (
              <Grid2
                item
                sx={{ width: "100%", mt: 1 }}
                container
                direction="row"
                alignItems="center"
                justifyContent="space-evenly"
              >
                <TextField
                  placeholder="Pesquise..."
                  size="small"
                  sx={{ mx: 2, mt: 1 }}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <icons.SearchIcon />
                      </InputAdornment>
                    ),
                    endAdornment:
                      searchValue.length > 0 ? (
                        <InputAdornment position="end">
                          <icons.ClearIcon
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
                        height: 40,
                        width: 150,
                        mx: "auto",
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid2>
            )}
            {filteredActivities.length !== 0 ? (
              filteredActivities.reverse().map((activity) => (
                <Grid2 key={activity.id} item sx={{ mt: 1 }}>
                  <Typography sx={{ fontSize: 13, maxWidth: 650 }}>
                    <Typography sx={{ fontSize: 12, color: "grey" }}>
                      {activity.createdAt}
                    </Typography>
                    {activity.activity}
                  </Typography>
                </Grid2>
              ))
            ) : (
              <Typography
                sx={{ fontSize: 14, color: "grey", mt: 2, textAlign: "center" }}
              >
                Nenhuma Atividade{" "}
                {recentActivities.length === 0 ? "Recente" : "Localizada"}
              </Typography>
            )}
          </Grid2>
        </Grid2>
      </Grid2>
    </>
  );
};

export default HomeRecentActivity;
