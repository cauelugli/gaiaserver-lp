/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

import { Grid, Typography } from "@mui/material";

const socket = io("http://localhost:3000");

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const HomeRecentActivity = () => {
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const recentActivities = await api.get("/recentActivity");
        setRecentActivities(recentActivities.data);
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

  return (
    <>
      <Grid
        sx={{
          mx: 1,
          height: 120,
          width: "100%",
          backgroundColor: "rgba(44,147,147, 0.9)",
          border: "1px solid #2c9393",
          borderRadius: 2,
        }}
      >
        {recentActivities.map((activity) => activity.activity)}
      </Grid>
      <Typography
        sx={{
          mt: 0.5,
          ml: "90%",
          fontSize: 12,
          color: "grey",
          cursor: "pointer",
        }}
      >
        ver mais
      </Typography>
    </>
  );
};

export default HomeRecentActivity;
