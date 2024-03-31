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
    <Grid sx={{ width: 700, px: 1 }}>
      <Typography
        sx={{
          fontWeight: "bold",
          fontSize: 18,
          ml: 0.5,
        }}
      >
        Atividade Recente
      </Typography>
      <Grid
        sx={{
          height: 110,
          width: "auto",
          border: "1px solid #2c9393",
          borderRadius: 2,
          overflow: "auto",
        }}
      >
        <Grid container direction="column">
          {[...recentActivities].reverse().map((activity) => (
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
