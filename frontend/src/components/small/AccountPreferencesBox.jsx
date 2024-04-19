/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";

import { FormControlLabel, Grid, Switch, Typography } from "@mui/material";

const AccountPreferencesBox = ({ onUpdateDarkMode }) => {
  const [checkedDarkMode, setCheckedDarkMode] = useState(
    JSON.parse(sessionStorage.getItem("userPreferences"))?.darkMode === true
  );

  useEffect(() => {
    const preferences = JSON.parse(sessionStorage.getItem("userPreferences"));
    const darkModeStored = preferences?.darkMode === true;
    if (checkedDarkMode !== darkModeStored) {
      setCheckedDarkMode(darkModeStored);
    }
  }, []);

  const handleChangeDarkMode = (event) => {
    const newDarkMode = event.target.checked;
    setCheckedDarkMode(newDarkMode);

    const updatedPreferences = {
      ...JSON.parse(sessionStorage.getItem("userPreferences")),
      darkMode: newDarkMode,
    };
    sessionStorage.setItem(
      "userPreferences",
      JSON.stringify(updatedPreferences)
    );

    onUpdateDarkMode(newDarkMode);
  };

  return (
    <Grid
      sx={{
        width: 250,
        height: 200,
        border: "1px solid #ccc",
        borderRadius: 2,
      }}
    >
      <Typography
        sx={{ my: 1, textAlign: "center", fontSize: 13, color: "#555" }}
      >
        OPÇÕES
      </Typography>
      <Grid
        container
        sx={{ mt: 1 }}
        direction="column"
        alignContent="center"
        justifyContent="center"
        rowSpacing={2}
      >
        <FormControlLabel
          labelPlacement="start"
          label="Modo Escuro"
          control={
            <Switch checked={checkedDarkMode} onChange={handleChangeDarkMode} />
          }
        />
        {/* <FormControlLabel
          labelPlacement="start"
          label="Modo Escuro"
          control={
            <Switch checked={checkedDarkMode} onChange={handleChangeDarkMode} />
          }
        /> */}
      </Grid>
    </Grid>
  );
};

export default AccountPreferencesBox;
