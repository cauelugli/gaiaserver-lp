/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";

import { Box, CircularProgress, Grid, Typography } from "@mui/material";

import SwitchAccessShortcutIcon from "@mui/icons-material/SwitchAccessShortcut";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const UserShortcuts = ({ user, onShortcutClick }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [userPreferences, setUserPreferences] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const preferences = await api.get(`/userPreferences/${user._id}`);

        setUserPreferences(preferences.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [user]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  const shortcuts = userPreferences.userShortcuts || [];

  return (
    <Grid
      sx={{
        height: 300,
        width: "auto",
        backgroundColor: "#eee",
        borderRadius: 1,
        mb: 1,
      }}
    >
      <Grid item>
        <Grid
          container
          direction="row"
          alignItems="center"
          justifyContent="center"
        >
          <Typography
            sx={{
              py: 1,
              mt: 2,
              ml: 3,
              fontSize: 18,
              fontWeight: "bold",
              color: "#555",
              fontFamily: "Verdana, sans-serif",
            }}
          >
            Atalhos
          </Typography>
          <SwitchAccessShortcutIcon sx={{ fontSize: 24, color: "#555" }} />
        </Grid>
      </Grid>

      <Grid item sx={{ m: 2 }}>
        {shortcuts
          .filter((shortcut) => shortcut.isActive)
          .map((shortcut, index) => (
            <Grid
              container
              key={index}
              direction="row"
              justifyContent="space-between"
              sx={{
                mb: 1,
                backgroundColor: "#fff",
                borderRadius: 2,
                color: "#777",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#ddd",
                },
              }}
              onClick={() => onShortcutClick(shortcut)}
            >
              <Typography
                id="ghostDiv"
                sx={{
                  p: 1,
                  fontSize: 12,
                  color: "white",
                  "&:hover": {
                    color: "#ddd",
                  },
                }}
              >
                .
              </Typography>
              <Typography
                sx={{
                  p: 1,
                  fontSize: 12,

                  fontFamily: "Verdana, sans-serif",
                  mx: "auto",
                }}
              >
                {shortcut.name.toUpperCase()}
              </Typography>
              <Typography
                sx={{
                  p: 1,
                  fontSize: 12,
                  borderRadius: 2,

                  fontFamily: "Verdana, sans-serif",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#bbb",
                  },
                }}
              >
                ...
              </Typography>
            </Grid>
          ))}

        {shortcuts.filter((shortcut) => shortcut.isActive).length !== 5 && (
          <Typography
            sx={{
              p: 1,
              px: 2,
              fontSize: 12,
              fontFamily: "Verdana, sans-serif",
              mb: 1,
              backgroundColor: "#fff",
              borderRadius: 2,
              color: "#777",
              textAlign: "center",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#ddd",
              },
            }}
          >
            ADICIONAR ATALHO
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default UserShortcuts;
