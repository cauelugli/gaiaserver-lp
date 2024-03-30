/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";

import { Box, CircularProgress, Grid, Typography } from "@mui/material";

import SwitchAccessShortcutIcon from "@mui/icons-material/SwitchAccessShortcut";
import NewUserShortcut from "./NewUserShortcut";
import ShortcutItem from "./ShortcutItem";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const UserShortcuts = ({ user, onShortcutClick }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [userPreferences, setUserPreferences] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedShortcut, setSelectedShortcut] = React.useState("");

  const fetchData = async () => {
    try {
      const preferences = await api.get(`/userPreferences/${user._id}`);
      setUserPreferences(preferences.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const reloadShortcuts = () => {
    setIsLoading(true);
    fetchData();
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  const shortcuts = userPreferences.userShortcuts || [];

  const handleDeleteShortcut = async (shortcutName) => {
    try {
      await api.put("/userPreferences/deleteShortcut", {
        userId: user._id,
        shortcutName,
      });
      reloadShortcuts();
      setAnchorEl(null);
    } catch (error) {
      console.error("Error deleting shortcut:", error);
    }
  };

  return (
    <Grid
      sx={{
        height:
          shortcuts.filter((shortcut) => shortcut.isActive).length === 5
            ? 300
            : shortcuts.length * 60 + 60,
        width: "auto",
        backgroundColor: "#eee",
        border: "1px solid #ddd",
        borderRadius: 4,
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
            <ShortcutItem
              key={index}
              shortcut={shortcut}
              onShortcutClick={onShortcutClick}
              onDeleteShortcut={handleDeleteShortcut}
            />
          ))}

        {shortcuts.filter((shortcut) => shortcut.isActive).length !== 5 && (
          <NewUserShortcut user={user} reloadShortcuts={reloadShortcuts} />
        )}
      </Grid>
    </Grid>
  );
};

export default UserShortcuts;
