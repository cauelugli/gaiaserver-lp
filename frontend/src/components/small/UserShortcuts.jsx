/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Box,
  CircularProgress,
  Grid,
  Typography,
  IconButton,
  Collapse,
} from "@mui/material";

import { icons } from "../../icons";

import NewUserShortcut from "./NewUserShortcut";
import ShortcutItem from "./ShortcutItem";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const UserShortcuts = ({ userId, onShortcutClick, allowedLinks }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [userPreferences, setUserPreferences] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);

  const fetchData = async () => {
    try {
      const preferences = await api.get(`/userPreferences/${userId}`);
      setUserPreferences(preferences.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

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

  const shortcuts = userPreferences?.userShortcuts || [];

  const handleDeleteShortcut = async (shortcutName) => {
    try {
      await api.put("/userPreferences/deleteShortcut", {
        userId: userId,
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
        height: open
          ? shortcuts.filter((shortcut) => shortcut.isActive).length * 50 + 120
          : 45,
        backgroundColor: "#f8f8ff",
        border: "1px solid #e7e7ee",
        borderRadius: 3,
        width: 320,
      }}
    >
      <Grid item>
        <Grid
          container
          direction="row"
          justifyContent="space-around"
          alignItems="center"
        >
          <Typography id="ghost" />
          <Typography
            sx={{
              px: "25%",
              mt: -1,
              fontSize: 16,
              fontWeight: "bold",
              color: "#555",
            }}
          >
            Atalhos
          </Typography>
          <IconButton
            onClick={() => setOpen(!open)}
            sx={{ mb: 1, color: "black" }}
          >
            {open ? <icons.ExpandLessIcon /> : <icons.ExpandMoreIcon />}
          </IconButton>
        </Grid>
      </Grid>

      <Grid item sx={{ m: 2 }}>
        <Collapse in={open}>
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
          <NewUserShortcut
            userId={userId}
            reloadShortcuts={reloadShortcuts}
            allowedLinks={allowedLinks}
          />
        </Collapse>
      </Grid>
    </Grid>
  );
};

export default UserShortcuts;
