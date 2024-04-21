/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";

import { FormControlLabel, Grid, Switch, Typography } from "@mui/material";

const AccountPreferencesBox = ({ onUpdateDarkMode, onUpdateBarPosition }) => {
  const [checkedDarkMode, setCheckedDarkMode] = useState(
    JSON.parse(sessionStorage.getItem("userPreferences"))?.darkMode === true
  );
  const [checkedBarPosition, setCheckedBarPosition] = useState(
    JSON.parse(sessionStorage.getItem("userPreferences"))?.barPosition === true
  );

  useEffect(() => {
    const preferences = JSON.parse(sessionStorage.getItem("userPreferences"));

    const darkModeStored = preferences?.darkMode === true;
    const barPositionStored = preferences?.barPosition === true;

    if (checkedDarkMode !== darkModeStored) {
      setCheckedDarkMode(darkModeStored);
    }

    if (checkedBarPosition !== barPositionStored) {
      setCheckedBarPosition(barPositionStored);
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

  const handleChangeBarPosition = (event) => {
    const newBarPosition = event.target.checked;
    setCheckedBarPosition(newBarPosition);

    const updatedPreferences = {
      ...JSON.parse(sessionStorage.getItem("userPreferences")),
      barPosition: newBarPosition,
    };
    sessionStorage.setItem(
      "userPreferences",
      JSON.stringify(updatedPreferences)
    );

    onUpdateBarPosition(newBarPosition);
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
        <Grid>
          <FormControlLabel
            labelPlacement="start"
            label="Modo Escuro"
            control={
              <Switch
                checked={checkedDarkMode}
                onChange={handleChangeDarkMode}
              />
            }
          />
        </Grid>
        <Grid>
          <FormControlLabel
            labelPlacement="start"
            label={`Barra ${checkedBarPosition ? "Superior" : "Lateral"}`}
            control={
              <Switch
                checked={checkedBarPosition}
                onChange={handleChangeBarPosition}
              />
            }
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AccountPreferencesBox;
